import {
  Button,
  LoadingData,
  InputTextField,
  SelectField,
  TextAreaField,
  ScrollContainer,
  FileUploadButton,
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
import {
  buildCategoryPayload,
  handleFileUpload,
  handleInputChange as utilHandleInputChange,
} from '@/utils';

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
    imageFile: null, // For file upload
    priority: 1,
    status: 'active',
    parentId: '',
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Use validation hook
  const validationSchema = isEditMode
    ? subSubCategoryUpdateSchema
    : subSubCategoryCreateSchema;
  const { validate, errors, setErrors, clearErrors, clearFieldError } =
    useValidation(validationSchema);

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
          id: category._id || category.id, // Add id for validation
          name: category.name || '',
          description: category.description || '',
          image: category.image || null,
          imageFile: null, // Reset file upload when editing
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
    utilHandleInputChange(e, setFormData, clearFieldError);
  };

  const handleFileSelect = (file) => {
    handleFileUpload(file, setFormData, 'image', {
      clearErrors: clearFieldError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      // Prepare data for validation (include id for update mode)
      const validationData = {
        ...formData,
        id: isEditMode ? categoryId : undefined,
      };
      
      // Use validation schema instead of manual validation
      const isValid = await validate(validationData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Simple duplicate check before submitting
      const existingCategories = await categoryService.getAll({
        level: 2,
        status: 'active',
        parentId: formData.parentId,
      });
      if (existingCategories?.data?.success && existingCategories.data.data) {
        const duplicateCategory = existingCategories.data.data.find(
          (category) =>
            category.name.toLowerCase() === formData.name.toLowerCase() &&
            category._id !== categoryId,
        );

        if (duplicateCategory) {
          toast.error(
            'Sub-sub-category name already exists under this parent. Please choose a different name.',
          );
          setLoading(false);
          return;
        }
      }

      // Build API payload using utility function
      // Remove id field from payload as it's not allowed by backend
      const { id, ...payloadData } = formData;
      const apiPayload = buildCategoryPayload(payloadData);

      let response;
      if (isEditMode) {
        response = await categoryService.update(categoryId, apiPayload);
      } else {
        response = await categoryService.create(apiPayload);
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
          imageFile: null,
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
        // Set errors using validation hook
        Object.keys(validationErrors).forEach((key) => {
          setErrors((prev) => ({
            ...prev,
            [key]: validationErrors[key],
          }));
        });
        // Don't show toast for validation errors, they will be displayed in fields
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
      imageFile: null,
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
        {loadingSubCategories ? (
          <LoadingData message="Loading sub-categories..." />
        ) : (
          <ScrollContainer>
            <form
              onSubmit={handleSubmit}
              className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 "
            >
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

              <FileUploadButton
                label="Sub Sub Category Image"
                id="image"
                accept="image/*"
                onFileSelect={handleFileSelect}
                showPreview={true}
                previewValue={formData.image}
                error={errors?.image}
                className="sm:col-span-2"
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
          </ScrollContainer>
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
