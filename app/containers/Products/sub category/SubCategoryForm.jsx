import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import TextAreaField from '@/components/custom-forms/TextAreaField';
import categoryService from '@/api/service/categoryService';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoadingData } from '@/components/custom-pages';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be less than 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  metaTitle: Yup.string()
    .required('Meta title is required')
    .min(10, 'Meta title must be at least 10 characters')
    .max(60, 'Meta title must be less than 60 characters'),
  metaDescription: Yup.string()
    .required('Meta description is required')
    .min(20, 'Meta description must be at least 20 characters')
    .max(160, 'Meta description must be less than 160 characters'),
  image: Yup.string().url('Please enter a valid URL').nullable(),
  priority: Yup.number()
    .required('Priority is required')
    .min(1, 'Priority must be at least 1')
    .max(100, 'Priority must be less than 100')
    .integer('Priority must be a whole number'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive'),
  parentId: Yup.string().required('Parent category is required'),
  // isFeatured: Yup.boolean(),
});

const SubCategoryForm = ({ onSuccess, onCancel, categoryId, isEditMode }) => {
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
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        // Filter only Level 0 categories (main categories) for dropdown
        const mainCategories = response.data.filter((cat) => cat.level === 0);

        const formattedCategories = mainCategories.map((cat) => ({
          ...cat,
          displayName: `${cat.name} (Level ${cat.level})`,
        }));

        setCategories(formattedCategories);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
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
        toast.error('Failed to fetch sub category data');
        return;
      }

      if (category) {
        // Handle parentId - it might be an object, string, or null

        console.log(
          'ParentId type:',
          typeof category.parentId,
          category.parentId,
        );

        let parentId = '';
        if (category.parentId) {
          if (typeof category.parentId === 'object' && category.parentId._id) {
            parentId = category.parentId._id;
            console.log('Extracted parentId from object:', parentId);
          } else if (typeof category.parentId === 'string') {
            parentId = category.parentId;
          }
        } else if (category.parentId === null) {
          // If parentId is null, check if there's a parent field or if we need to use path
          console.log('ParentId is null, checking for parent field...');
          if (category.parent && category.parent._id) {
            parentId = category.parent._id;
            console.log('Found parent field, using parent._id:', parentId);
          } else if (category.path) {
            // Try to find a category that matches the path
            console.log('Using path to find parent:', category.path);
            console.log(
              'Available category IDs:',
              categories.map((cat) => cat._id),
            );

            const parentExists = categories.find(
              (cat) => cat._id === category.path,
            );
            if (parentExists) {
              parentId = category.path;
            } else {
              console.log('Path does not match any available category');
              console.log('Path ID:', category.path);
              console.log(
                'Available IDs:',
                categories.map((cat) => cat._id),
              );

              // For now, leave it empty so user can select the correct parent
              parentId = '';

              // Show a warning to the user
              toast.warning(
                'Parent category not found. Please select the correct parent category.',
              );
            }
          } else {
            parentId = '';
          }
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
        s;
        console.log('Available categories:', categories);
      } else {
        toast.error('No sub category data found');
      }
    } catch (error) {
      // Check if it's a JSON parsing error
      if (error.message.includes('Unexpected token')) {
        toast.error('Server returned invalid response format');
      } else {
        toast.error('Failed to fetch sub category data: ' + error.message);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [categoryId]);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && categoryId && categories.length > 0) {
      fetchCategoryData();
    }
  }, [isEditMode, categoryId, fetchCategoryData, categories.length]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });

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
          `Sub Category ${isEditMode ? 'updated' : 'added'} successfully!`,
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
        setFormErrors({});

        // Notify parent component (this will trigger navigation)
        if (onSuccess) {
          onSuccess(response.data.data || response.data);
        }
      } else {
        toast.error('Failed to save sub category');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setFormErrors(validationErrors);
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
          `Failed to ${isEditMode ? 'update' : 'add'} sub category`;
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
    setFormErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        {isEditMode && loadingCategories ? (
          <LoadingData message="Loading data..." />
        ) : (
          <form
            style={{ minHeight: '400px', overflowY: 'auto', height: '450px' }}
            onSubmit={handleSubmit}
            className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <SelectField
              label="Category"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              options={(() => {
                const options = [
                  { value: '', label: 'Select Category' },
                  ...categories.map((cat) => ({
                    value: cat._id,
                    label: cat.displayName,
                  })),
                ];
                console.log('Dropdown options:', options);
                console.log(
                  'Looking for parentId in options:',
                  formData.parentId,
                );
                const foundOption = options.find(
                  (opt) => opt.value === formData.parentId,
                );

                return options;
              })()}
              error={formErrors?.parentId}
              disabled={loadingCategories}
            />

            <InputTextField
              label="Sub Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter sub category"
              error={formErrors?.name}
            />

            {/* {loadingCategories && <LoadingData message="Loading categories" />} */}

            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter sub category description"
              rows={2}
              error={formErrors?.description}
              className="sm:col-span-2"
            />

            <InputTextField
              label="Image URL"
              type="url"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              error={formErrors?.image}
            />

            <InputTextField
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="Enter meta title"
              error={formErrors?.metaTitle}
            />

            <TextAreaField
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              placeholder="Enter meta description"
              rows={2}
              error={formErrors?.metaDescription}
              className="sm:col-span-2"
            />

            <InputTextField
              label="Priority"
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              placeholder="e.g. 1"
              error={formErrors?.priority}
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
              error={formErrors?.status}
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
                  ? 'Update Sub Category'
                  : 'Add Sub Category'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

SubCategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export default SubCategoryForm;
