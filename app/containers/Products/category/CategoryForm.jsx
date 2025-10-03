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
import PropTypes from 'prop-types';
import {
  useValidation,
  categoryCreateSchema,
  categoryUpdateSchema,
} from '@/validations';

const CategoryForm = ({ onSuccess, onCancel, categoryId, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    image: null,
    imageFile: null, // For file upload
    priority: 1,
    status: 'active',
    parentId: '', // Add parentId for sub-category selection
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Use validation hook
  const validationSchema = isEditMode
    ? categoryUpdateSchema
    : categoryCreateSchema;
  const { errors, validate, clearErrors, clearFieldError } = useValidation(validationSchema, {
    showToast: false, // Disable automatic toast, we'll show specific errors
  });

  const fetchCategoryData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      let response = await categoryService.getById(categoryId);
      if (typeof response?.data === 'string') {
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

  // Fetch all sub categories (level 1) for dropdown
  const fetchSubCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (isEditMode && categoryId) {
      fetchCategoryData();
    }
  }, [isEditMode, categoryId, fetchCategoryData]);

  // Load sub-categories on component mount
  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field error when user starts typing
    if (errors?.[name]) {
      clearFieldError(name);
    }
  };

  const handleFileUpload = (file) => {
    setFormData({
      ...formData,
      imageFile: file,
    });
    
    // Clear field error when file is selected
    if (errors?.image) {
      clearFieldError('image');
    }
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
      };

      // Validate form data
      const isValid = await validate(validationData);
      if (!isValid) {
        // Show specific validation errors
        if (Object.keys(errors).length > 0) {
          toast.error('Please fill the required fields');
        }
        setLoading(false);
        return;
      }

      // Simple duplicate check before submitting
      const existingCategories = await categoryService.getAll({ level: 0, status: 'active' });
      if (existingCategories?.data?.success && existingCategories.data.data) {
        const duplicateCategory = existingCategories.data.data.find(category => 
          category.name.toLowerCase() === formData.name.toLowerCase() && 
          category._id !== categoryId
        );
        
        if (duplicateCategory) {
          toast.error('Category name already exists. Please choose a different name.');
          setLoading(false);
          return;
        }
      }

      // Check if we have new file uploads
      const imageInput = document.getElementById('image');
      const hasNewImage = imageInput && imageInput.files && imageInput.files[0];
      
      let response;
      
      // If we have new file uploads, use FormData
      if (hasNewImage) {
        const formDataToSend = new FormData();
        
        // Add basic fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('metaTitle', formData.metaTitle || '');
        formDataToSend.append('metaDescription', formData.metaDescription || '');
        formDataToSend.append('priority', formData.priority);
        formDataToSend.append('status', formData.status);
        if (formData.parentId) {
          formDataToSend.append('parentId', formData.parentId);
        }
        
        // Handle image file upload
        formDataToSend.append('image', imageInput.files[0]);
        
        if (isEditMode) {
          response = await categoryService.update(categoryId, formDataToSend);
        } else {
          response = await categoryService.create(formDataToSend);
        }
      } else {
        // No file upload, send regular JSON data
        const { imageFile, image, ...apiData } = formData;
        // Only include parentId if it's not empty
        if (!apiData.parentId) {
          delete apiData.parentId;
        }
        
        if (isEditMode) {
          response = await categoryService.update(categoryId, apiData);
        } else {
          response = await categoryService.create(apiData);
        }
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
          imageFile: null,
          metaTitle: '',
          metaDescription: '',
          priority: 1,
          status: 'active',
          parentId: '',
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
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
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
        ) : loadingSubCategories ? (
          <LoadingData message="Loading sub-categories..." size="50px" />
        ) : (
          <ScrollContainer>
            <form
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

              <SelectField
                label="Parent Category (Optional)"
                name="parentId"
                value={formData.parentId}
                onChange={handleInputChange}
                options={(() => {
                  const options = [
                    { value: '', label: 'Select Parent Category (Optional)' },
                    ...subCategories.map((cat) => ({
                      value: cat._id,
                      label: cat.displayName,
                    })),
                  ];
                  return options;
                })()}
                error={errors?.parentId}
                disabled={loadingSubCategories}
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

              <FileUploadButton
                label="Category Image"
                id="image"
                accept="image/*"
                onFileSelect={handleFileUpload}
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
                    ? 'Update Category'
                    : 'Add Category'}
                </Button>
              </div>
            </form>
          </ScrollContainer>
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
