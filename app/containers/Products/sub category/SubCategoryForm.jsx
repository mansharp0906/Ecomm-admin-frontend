import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import TextAreaField from '@/components/custom-forms/TextAreaField';
import categoryService from '@/api/service/categoryService';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be less than 50 characters'),
  slug: Yup.string(),
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

const SubCategoryForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
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
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

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
      const { slug: _slug, image: _image, ...apiData } = formData;
      console.log('Sending data to API:', apiData); // Debug log
      const response = await categoryService.create(apiData);
      console.log('Sub Category Created Response:', response);

      // Check for successful response (status 201 or 200)
      if (
        response?.status === 201 ||
        response?.status === 200 ||
        response?.data
      ) {
        console.log('Sub Category Created Successfully:', response.data);
        toast.success('Sub Category added successfully!');

        // Reset form
        setFormData({
          name: '',
          slug: '',
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

        // Notify parent component
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        // Handle case where response exists but indicates failure
        const errorMessage =
          response?.data?.message || 'Failed to create sub category';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('API Error Details:', error.response?.data); // Debug log

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
          error.response?.data?.message || 'Failed to add sub category';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      slug: '',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto flex flex-col h-[95vh]">
        {/* Header */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Add New Sub Category</h2>
            </div>
          </div>
        </div>

        {/* Form Fields - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {/* Row 1: Category and Sub Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Category"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Category' },
                ...categories.map((cat) => ({
                  value: cat._id,
                  label: cat.displayName,
                })),
              ]}
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
          </div>

          {loadingCategories && (
            <div className="text-sm text-gray-500 text-center">
              Loading categories...
            </div>
          )}

          {/* Row 2: Description (Full Width) */}
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter sub category description"
            rows={3}
            error={formErrors?.description}
          />

          {/* Row 3: Image URL and Meta Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Row 4: Meta Description (Full Width) */}
          <TextAreaField
            label="Meta Description"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleInputChange}
            placeholder="Enter meta description"
            rows={3}
            error={formErrors?.metaDescription}
          />

          {/* Row 5: Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </form>

        {/* Buttons - Fixed at bottom */}
        <div className="p-4 border-t flex-shrink-0 flex space-x-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1 py-2 text-base"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="flex-1 py-2 text-base"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

SubCategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SubCategoryForm;
