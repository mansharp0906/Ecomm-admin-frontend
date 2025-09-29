import {
  Button,
  LoadingData,
  InputTextField,
  SelectField,
  TextAreaField,
} from '@/components';
import categoryService from '@/api/service/categoryService';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useValidation } from '@/validations';
import {
  subSubCategoryCreateSchema,
  subSubCategoryUpdateSchema,
} from '@/validations';
import PropTypes from 'prop-types';

const SubSubCategoryForm = ({
  onSuccess,
  onCancel,
  categoryId,
  isEditMode,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    image: null,
    priority: 1,
    status: 'active',
    parentId: '',
    isFeatured: false,
    level: 2, // Add level field for sub-sub-category
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Use validation hook
  const validationSchema = isEditMode
    ? subSubCategoryUpdateSchema
    : subSubCategoryCreateSchema;
  const { validate, errors, setErrors } = useValidation(validationSchema);

  // Fetch all sub categories (level 1) for dropdown
  const fetchSubCategories = async () => {
    setLoadingSubCategories(true);
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        // Extract all sub categories (level 1) from the tree structure
        const allSubCategories = [];

        const extractSubCategories = (categories) => {
          categories.forEach((category) => {
            if (category.children && category.children.length > 0) {
              // Check if children are Level 1 (sub categories)
              const level1Children = category.children.filter(
                (child) => child.level === 1,
              );
              if (level1Children.length > 0) {
                allSubCategories.push(...level1Children);
              }
              // Recursively extract from deeper levels
              extractSubCategories(category.children);
            }
          });
        };

        extractSubCategories(response.data);

        const formattedSubCategories = allSubCategories.map((cat) => ({
          ...cat,
          displayName: `${cat.name} (${
            cat.parentId ? 'Sub Category' : 'Main Category'
          })`,
        }));

        setSubCategories(formattedSubCategories);
      }
    } catch (error) {
      toast.error('Failed to load sub categories');
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // Fetch category data for edit mode
  const fetchCategoryData = useCallback(async () => {
    try {
      setIsLoadingData(true);

      // Use categoryService instead of direct fetch
      let response = await categoryService.getById(categoryId);

      // Check if response is HTML (error page)
      if (
        typeof response?.data === 'string' &&
        response.data.includes('<!DOCTYPE')
      ) {
        toast.error('Server error: API returned HTML instead of JSON');
        return;
      }

      // Determine the correct data structure
      let category;
      if (response?.data?.success) {
        category = response.data.data;
      } else if (response?.data) {
        // If response.data exists but no success field, assume data is directly in response.data
        category = response.data;
      } else {
        toast.error('Failed to fetch sub sub category data');
        return;
      }

      if (category) {
        // Handle parentId - it might be an object, string, or null
        let parentId = '';
        if (category.parentId) {
          if (typeof category.parentId === 'object' && category.parentId._id) {
            parentId = category.parentId._id;
          } else if (typeof category.parentId === 'string') {
            parentId = category.parentId;
          }
        } else if (category.parentId === null && category.path) {
          // If parentId is null but path exists, use path as parentId
          parentId = category.path;
        } else if (category.parentId === null) {
          // If parentId is null and no path, this sub-sub-category has no parent
        }

        const newFormData = {
          name: category.name || '',
          description: category.description || '',
          image: category.image || null,
          priority: category.priority || 1,
          status: category.status || 'active',
          isFeatured: category.isFeatured || false,
          metaTitle: category.metaTitle || '',
          metaDescription: category.metaDescription || '',
          parentId: parentId,
        };
        setFormData(newFormData);
      } else {
        toast.error('No sub sub category data found');
      }
    } catch (error) {
      // Check if it's a JSON parsing error
      if (error.message.includes('Unexpected token')) {
        toast.error('Server returned invalid response format');
      } else {
        toast.error('Failed to fetch sub sub category data: ' + error.message);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [categoryId]);

  // Load sub categories on component mount
  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && categoryId && subCategories.length > 0) {
      fetchCategoryData();
    }
  }, [isEditMode, categoryId, fetchCategoryData, subCategories.length]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data using validation hook
      const isValid = await validate(formData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Remove fields that backend doesn't allow
      const { image: _image, ...apiData } = formData;

      let response;
      if (isEditMode) {
        response = await categoryService.update(categoryId, apiData);
      } else {
        response = await categoryService.create(apiData);
      }

      const isSuccess =
        response?.data?.success ||
        (response?.status >= 200 && response?.status < 300);

      if (isSuccess) {
        toast.success(
          `Sub Sub Category ${isEditMode ? 'updated' : 'added'} successfully!`,
        );

        // Reset form for both create and edit modes
        setFormData({
          name: '',
          description: '',
          image: null,
          metaTitle: '',
          metaDescription: '',
          priority: 1,
          status: 'active',
          parentId: '',
          isFeatured: false,
        });
        setErrors({});

        // Notify parent component (this will trigger navigation)
        if (onSuccess) {
          onSuccess(response.data.data || response.data);
        }
      } else {
        toast.error('Failed to save sub sub category');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        toast.error('Please fix the validation errors');
      } else if (
        error.response?.status === 500 &&
        error.response?.data?.error?.includes('duplicate key')
      ) {
        // Handle duplicate slug error
        toast.error(
          'A category with this name already exists. Please choose a different name.',
        );
      } else {
        // Handle other API errors
        const errorMessage =
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} sub sub category`;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
      metaTitle: '',
      metaDescription: '',
      priority: 1,
      status: 'active',
      parentId: '',
      isFeatured: false,
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        {isEditMode && loadingSubCategories ? (
          <LoadingData message="Loading data..." />
        ) : (>
          <form   style={{ minHeight: '400px', overflowY: 'auto', height: '450px' }}>
            <SelectField
              label="Sub Category"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Sub Category' },
                ...subCategories.map((cat) => ({
                  value: cat._id,
                  label: cat.displayName,
                })),
              ]}
              error={errors?.parentId}
              disabled={loadingSubCategories}
            />

            <InputTextField
              label="Sub Sub Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter sub sub category name"
              error={errors?.name}
            />

            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter sub sub category description"
              rows={2}
              error={errors?.description}
              className="sm:col-span-2"
            />

            <InputTextField
              label="Image URL"
              type="url"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              error={errors?.image}
            />

            <InputTextField
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="Enter meta title"
              error={errors?.metaTitle}
            />

            <TextAreaField
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              placeholder="Enter meta description"
              rows={2}
              error={errors?.metaDescription}
              className="sm:col-span-2"
            />

            <InputTextField
              label="Priority"
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              placeholder="e.g. 1"
              error={errors?.priority}
            />

            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              error={errors?.status}
            />

            {/* Buttons should span full width */}
            <div className="sm:col-span-2 flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8"
              >
                {loading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Adding...'
                  : isEditMode
                  ? 'Update'
                  : 'Add'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

SubSubCategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export default SubSubCategoryForm;
