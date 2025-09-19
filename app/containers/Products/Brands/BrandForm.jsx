import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import TextAreaField from '@/components/custom-forms/TextAreaField';

// Validation schema for brand form
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(50, 'Brand name must be less than 50 characters'),
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
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),
});

function BrandForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    image: '',
    priority: 1,
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      // API call example - replace with actual service method
      const response = await brandService.create(formData);

      if (response?.data?.success) {
        toast.success('Brand added successfully!');
        setFormData({
          name: '',
          description: '',
          metaTitle: '',
          metaDescription: '',
          image: '',
          priority: 1,
          status: 'active',
        });
        if (onSuccess) onSuccess(response.data.data);
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error('Please fix the validation errors.');
      } else {
        toast.error(err.message || 'Failed to add brand.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      metaTitle: '',
      metaDescription: '',
      image: '',
      priority: 1,
      status: 'active',
    });
    setErrors({});
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 h-[90vh] flex flex-col">
        <header className="border-b p-6">
          <h2 className="text-xl font-semibold">Add New Brand</h2>
          <p className="text-sm text-gray-600 mt-1">Create a new brand</p>
        </header>
        <form
          onSubmit={handleSubmit}
          className="p-6 flex-1 overflow-y-auto space-y-4"
        >
          <InputTextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter brand name"
            error={errors.name}
          />
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={3}
            error={errors.description}
          />
          <InputTextField
            label="Meta Title"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="Enter meta title"
            error={errors.metaTitle}
          />
          <TextAreaField
            label="Meta Description"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Enter meta description"
            rows={3}
            error={errors.metaDescription}
          />
          <InputTextField
            label="Image URL"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            error={errors.image}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputTextField
              label="Priority"
              name="priority"
              type="number"
              value={formData.priority}
              onChange={handleChange}
              placeholder="Enter priority"
              error={errors.priority}
            />
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              error={errors.status}
            />
          </div>
        </form>
        <footer className="border-t p-6 flex space-x-4">
          <Button
            variant="primary"
            type="submit"
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Add Brand'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="flex-1"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  );
}

BrandForm.propTypes = {
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default BrandForm;
