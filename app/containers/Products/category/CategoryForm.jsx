import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import TextAreaField from '@/components/custom-forms/TextAreaField';
import categoryService from '@/api/service/categoryService';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

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
});

const CategoryForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    image: null,
    priority: 1,
    status: 'active',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      // eslint-disable-next-line no-unused-vars
      const { slug: _slug, image: _image, ...apiData } = formData;
      console.log('Sending data to API:', apiData); // Debug log
      const response = await categoryService.create(apiData);

      if (response?.data?.success) {
        console.log('Category Created Response:', response.data);
        console.log('Created Category:', response.data.data);
        toast.success('Category added successfully!');

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
        });
        setFormErrors({});

        // Notify parent component
        if (onSuccess) {
          onSuccess(response.data.data);
        }
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
      } else {
        console.error('API Error Details:', error.response?.data); // Debug log
        toast.error(error.response?.data?.message || 'Failed to add category');
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
    });
    setFormErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Category</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a new main category
          </p>
        </div>

        {/* Form Fields - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
          style={{ minHeight: '200px' }}
        >
          <InputTextField
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter category name"
            error={formErrors?.name}
          />

          <InputTextField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="Enter slug (auto-generated if empty)"
            error={formErrors?.slug}
          />

          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter category description"
            rows={3}
            error={formErrors?.description}
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
            rows={3}
            error={formErrors?.metaDescription}
          />

          <div className="grid grid-cols-2 gap-4">
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
        <div className="p-6 border-t flex space-x-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

CategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CategoryForm;
