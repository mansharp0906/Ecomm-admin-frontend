import { 
  Button, 
  LoadingData, 
  InputTextField, 
  SelectField, 
  TextAreaField 
} from '@/components';



import categoryService from '@/api/service/categoryService';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useValidation, categoryCreateSchema, categoryUpdateSchema } from '@/validations';

// Validation schemas are now imported from validations directory

const CategoryForm = ({ onSuccess, onCancel, categoryId, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    image: null,
    priority: 1,
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Use validation hook
  const validationSchema = isEditMode ? categoryUpdateSchema : categoryCreateSchema;
  const { errors, validate, clearErrors, setFieldError } = useValidation(validationSchema);

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
        toast.error('Failed to fetch category data');
        return;
      }

      if (category) {
        const newFormData = {
          name: category.name || '',
          description: category.description || '',
          image: category.image || null,
          priority: category.priority || 1,
          status: category.status || 'active',
          isFeatured: category.isFeatured || false,
          metaTitle: category.metaTitle || '',
          metaDescription: category.metaDescription || '',
        };

        setFormData(newFormData);
      } else {
        toast.error('No category data found');
      }
    } catch (error) {
      // Check if it's a JSON parsing error
      if (error.message.includes('Unexpected token')) {
        toast.error('Server returned invalid response format');
      } else {
        toast.error('Failed to fetch category data: ' + error.message);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (isEditMode && categoryId) {
      fetchCategoryData();
    }
  }, [isEditMode, categoryId, fetchCategoryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      // Prepare data for validation
      const validationData = {
        ...formData,
        id: isEditMode ? categoryId : undefined,
        level: 0, // Main category level
      };

      // Validate form data
      const isValid = await validate(validationData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Remove fields that backend doesn't allow
      // eslint-disable-next-line no-unused-vars
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
          `Category ${isEditMode ? 'updated' : 'added'} successfully!`,
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
        });
        clearErrors();

        // Notify parent component (this will trigger navigation)
        if (onSuccess) {
          onSuccess(response.data.data || response.data);
        }
      } else {
        toast.error('Failed to save category');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        // Set errors using validation hook
        Object.keys(validationErrors).forEach(key => {
          setFieldError(key, validationErrors[key]);
        });
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add category');
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
    });
    clearErrors();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        {isEditMode && isLoadingData ? (
          <LoadingData message="Loading data..." size="50px" />
        ) : (
          <form   style={{ minHeight: '400px', overflowY: 'auto', height: '450px' }}
            onSubmit={handleSubmit}
            className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <InputTextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              error={errors?.name}
            />

            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
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
                  ? 'Update Category'
                  : 'Add Category'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

CategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export default CategoryForm;
