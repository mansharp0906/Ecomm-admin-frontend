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
  subCategoryCreateSchema,
  subCategoryUpdateSchema,
} from '@/validations';
import PropTypes from 'prop-types';
import {
  buildCategoryPayload,
  handleFileUpload,
  handleInputChange as utilHandleInputChange
} from '@/utils';

const SubCategoryForm = ({ onSuccess, onCancel, categoryId, isEditMode }) => {
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
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Use validation hook
  const validationSchema = isEditMode
    ? subCategoryUpdateSchema
    : subCategoryCreateSchema;
  const { validate, errors, setErrors, clearErrors, clearFieldError } = useValidation(validationSchema);

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
        let parentId = '';
        if (category.parentId) {
          if (typeof category.parentId === 'object' && category.parentId._id) {
            parentId = category.parentId._id;
          } else if (typeof category.parentId === 'string') {
            parentId = category.parentId;
          }
        } else if (category.parentId === null) {
          // If parentId is null, check if there's a parent field or if we need to use path
          if (category.parent && category.parent._id) {
            parentId = category.parent._id;
          } else if (category.path) {
            // Try to find a category that matches the path
            const parentExists = categories.find(
              (cat) => cat._id === category.path,
            );
            if (parentExists) {
              parentId = category.path;
            } else {
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

  // Function to check if all required fields are filled
  const areAllRequiredFieldsFilled = (data) => {
    return (
      data.name && data.name.trim() !== '' &&
      data.parentId && data.parentId.trim() !== '' &&
      data.status && data.status.trim() !== ''
    );
  };

  const handleInputChange = (e) => {
    utilHandleInputChange(e, setFormData, clearFieldError);
  };

  const handleFileSelect = (file) => {
    handleFileUpload(file, setFormData, 'image', {
      clearErrors: clearFieldError
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      // Use validation schema instead of manual validation
      const isValid = await validate(formData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Simple duplicate check before submitting
      const existingCategories = await categoryService.getAll({ 
        level: 1, 
        status: 'active',
        parentId: formData.parentId 
      });
      if (existingCategories?.data?.success && existingCategories.data.data) {
        const duplicateCategory = existingCategories.data.data.find(category => 
          category.name.toLowerCase() === formData.name.toLowerCase() && 
          category._id !== categoryId
        );
        
        if (duplicateCategory) {
          toast.error('Sub-category name already exists under this parent. Please choose a different name.');
          setLoading(false);
          return;
        }
      }

      // Build API payload using utility function
      const apiPayload = buildCategoryPayload(formData);
      
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
          `Sub Category ${isEditMode ? 'updated' : 'added'} successfully!`,
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
        toast.error('Failed to save sub category');
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
          setErrors(prev => ({
            ...prev,
            [key]: validationErrors[key]
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
        {loadingCategories ? (
          <LoadingData message="Loading categories..." />
        ) : (
          <ScrollContainer>
            <form
              // style={{ minHeight: '400px', overflowY: 'auto', height: '450px' }}
              onSubmit={handleSubmit}
              className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-5"
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
                  return options;
                })()}
                error={errors?.parentId}
                disabled={loadingCategories}
              />

              <InputTextField
                label="Sub Category Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter sub category"
                error={errors?.name}
              />

              {/* {loadingCategories && <LoadingData message="Loading categories" />} */}

              <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter sub category description"
                rows={2}
                error={errors?.description}
                className="sm:col-span-2"
              />

              <FileUploadButton
                label="Sub Category Image"
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

SubCategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export default SubCategoryForm;
