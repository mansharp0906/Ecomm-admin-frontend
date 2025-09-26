import { Button, LoadingData, InputTextField, SelectField, TextAreaField } from '@/components';



import brandService from '@/api/service/brandService';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useValidation, brandCreateSchema, brandUpdateSchema } from '@/validations';

// Validation schemas are now imported from validations directory

const BrandForm = ({ onSuccess, onCancel, bandId, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    metaTitle: '',
    metaDescription: '',
    image: null,
    banner: null,
    priority: 1,
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Use validation hook
  const validationSchema = isEditMode ? brandUpdateSchema : brandCreateSchema;
  const { errors, validate, clearErrors, setFieldError } = useValidation(validationSchema);

  const fetchCategoryData = useCallback(async () => {
    try {
      setIsLoadingData(true);

      // Use BandsServices instead of direct fetch
      let response = await brandService.getById(bandId);

      // Check if response is HTML (error page)
      if (
        typeof response?.data === 'string' &&
        response.data.includes('<!DOCTYPE')
      ) {
        toast.error('Server error: API returned HTML instead of JSON');
        return;
      }

      // Determine the correct data structure
      let brand;
      if (response?.data?.success) {
        brand = response.data.data;
      } else if (response?.data) {
        // If response.data exists but no success field, assume data is directly in response.data
        brand = response.data;
      } else {
        toast.error('Failed to fetch brand data');
        return;
      }

      if (brand) {
        const newFormData = {
          name: brand.name || '',
          image: brand.image || null,
          banner: brand.image || null,
          priority: brand.priority || 1,
          status: brand.status || 'active',
          isFeatured: brand.isFeatured || false,
          metaTitle: brand.metaTitle || '',
          metaDescription: brand.metaDescription || '',
        };

        setFormData(newFormData);
      } else {
        toast.error('No brand data found');
      }
    } catch (error) {
      // Check if it's a JSON parsing error
      if (error.message.includes('Unexpected token')) {
        toast.error('Server returned invalid response format');
      } else {
        toast.error('Failed to fetch brand data: ' + error.message);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [bandId]);

  useEffect(() => {
    if (isEditMode && bandId) {
      fetchCategoryData();
    }
  }, [isEditMode, bandId, fetchCategoryData]);

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
        id: isEditMode ? bandId : undefined,
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
        response = await brandService.update(bandId, apiData);
      } else {
        response = await brandService.create(apiData);
      }

      const isSuccess =
        response?.data?.success ||
        (response?.status >= 200 && response?.status < 300);

      if (isSuccess) {
        toast.success(
          `Brand ${isEditMode ? 'updated' : 'added'} successfully!`,
        );

        // Reset form for both create and edit modes
        setFormData({
          name: '',
          image: null,
          banner: null,
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
        toast.error('Failed to save Brand');
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
        toast.error(error.response?.data?.message || 'Failed to add Brand');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      image: null,
      banner: null,
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
          <form style={{ minHeight: '400px', overflowY: 'auto' ,height: '450px'}}
            onSubmit={handleSubmit}
            className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <InputTextField
              label="Brand Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Brand name"
              error={errors?.name}
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
              label="Banner URL"
              type="url"
              name="banner"
              value={formData.banner || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              error={errors?.banner}
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
                  ? 'Update Band'
                  : 'Add Band'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default BrandForm;
