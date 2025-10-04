import { Button, LoadingData, InputTextField, SelectField, TextAreaField, FileUploadButton } from '@/components';



import brandService from '@/api/service/brandService';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useValidation, brandCreateSchema, brandUpdateSchema } from '@/validations';
import {
  buildBrandPayload,
  handleFileUpload,
  handleInputChange as utilHandleInputChange
} from '@/utils';

// Validation schemas are now imported from validations directory

const BrandForm = ({ onSuccess, onCancel, bandId, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
  const { errors, validate, clearErrors, clearFieldError, setFieldError } = useValidation(validationSchema);

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

      console.log('API Response:', response.data); // Debug log
      console.log('Brand data:', brand); // Debug log

      if (brand) {
        const newFormData = {
          name: brand.name || '',
          description: brand.description || '',
          image: brand.logo || null, // This should be the Cloudinary URL
          banner: brand.banner || null, // This should be the Cloudinary URL
          priority: brand.priority || 1,
          status: brand.status || 'active',
          metaTitle: brand.metaTitle || '',
          metaDescription: brand.metaDescription || '',
        };

        console.log('Setting form data:', newFormData); // Debug log
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
    utilHandleInputChange(e, setFormData, clearFieldError);
  };

  const handleLogoSelect = (file) => {
    handleFileUpload(file, setFormData, 'image', {
      clearErrors: clearFieldError
    });
  };

  const handleBannerSelect = (file) => {
    handleFileUpload(file, setFormData, 'banner', {
      clearErrors: clearFieldError
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

      // Build API payload using utility function
      const apiPayload = buildBrandPayload(formData);
      
      let response;
      if (isEditMode) {
        response = await brandService.update(bandId, apiPayload);
      } else {
        response = await brandService.create(apiPayload);
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
          description: '',
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
        toast.error('Please fill the required fields');
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
      description: '',
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
          <form   style={{ minHeight: '400px', overflowY: 'auto', height: '450px' }}
            onSubmit={handleSubmit}
            className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <InputTextField
              label="Brand Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Brand name"
              error={errors?.name}
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter brand description"
              rows={3}
              error={errors?.description}
              className="sm:col-span-2"
            />
            <FileUploadButton
              id="brand-logo"
              label="Logo Upload"
              accept="image/*"
              showPreview={true}
              previewValue={formData.image && formData.image.startsWith('http') ? formData.image : null}
              onFileSelect={handleLogoSelect}
              error={errors?.image}
            />
            <FileUploadButton
              id="brand-banner"
              label="Banner Upload"
              accept="image/*"
              showPreview={true}
              previewValue={formData.banner && formData.banner.startsWith('http') ? formData.banner : null}
              onFileSelect={handleBannerSelect}
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
