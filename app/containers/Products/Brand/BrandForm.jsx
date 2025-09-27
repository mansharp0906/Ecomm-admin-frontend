import { Button, LoadingData, InputTextField, SelectField, TextAreaField, FileUploadButton } from '@/components';



import brandService from '@/api/service/brandService';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useValidation, brandCreateSchema, brandUpdateSchema } from '@/validations';

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

      // Check if we have new file uploads
      const logoInput = document.getElementById('brand-logo');
      const bannerInput = document.getElementById('brand-banner');
      const hasNewLogo = logoInput && logoInput.files && logoInput.files[0];
      const hasNewBanner = bannerInput && bannerInput.files && bannerInput.files[0];
      
      let formDataToSend;
      
      // If we have new file uploads, use FormData
      if (hasNewLogo || hasNewBanner) {
        formDataToSend = new FormData();
        
        // Add basic fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('metaTitle', formData.metaTitle || '');
        formDataToSend.append('metaDescription', formData.metaDescription || '');
        formDataToSend.append('priority', formData.priority);
        formDataToSend.append('status', formData.status);
        
        // Handle logo file upload
        if (hasNewLogo) {
          formDataToSend.append('logo', logoInput.files[0]);
        } else if (formData.image && formData.image.startsWith('http')) {
          // If it's an existing URL, send it as a string
          formDataToSend.append('logo', formData.image);
        }
        
        // Handle banner file upload
        if (hasNewBanner) {
          formDataToSend.append('banner', bannerInput.files[0]);
        } else if (formData.banner && formData.banner.startsWith('http')) {
          // If it's an existing URL, send it as a string
          formDataToSend.append('banner', formData.banner);
        }
      } else {
        // No new file uploads, use regular JSON object
        formDataToSend = {
          name: formData.name,
          description: formData.description || '',
          metaTitle: formData.metaTitle || '',
          metaDescription: formData.metaDescription || '',
          priority: formData.priority,
          status: formData.status,
          logo: formData.image || null,
          banner: formData.banner || null,
        };
      }

      // Debug: Log what we're sending
      console.log('Form data being sent:', formData);
      console.log('Data to send:', formDataToSend);
      
      if (formDataToSend instanceof FormData) {
        console.log('FormData object contents:');
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }
      } else {
        console.log('JSON object contents:', formDataToSend);
      }

      let response;
      if (isEditMode) {
        response = await brandService.update(bandId, formDataToSend);
      } else {
        response = await brandService.create(formDataToSend);
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
              onFileSelect={(file) => {
                handleInputChange({ target: { name: 'image', value: `blob:${URL.createObjectURL(file)}` } });
              }}
              error={errors?.image}
            />
            <FileUploadButton
              id="brand-banner"
              label="Banner Upload"
              accept="image/*"
              showPreview={true}
              previewValue={formData.banner && formData.banner.startsWith('http') ? formData.banner : null}
              onFileSelect={(file) => {
                handleInputChange({ target: { name: 'banner', value: `blob:${URL.createObjectURL(file)}` } });
              }}
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
