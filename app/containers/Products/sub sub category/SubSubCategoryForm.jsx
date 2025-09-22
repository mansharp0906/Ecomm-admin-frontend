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
    .required('Sub Sub Category name is required')
    .min(2, 'Sub Sub Category name must be at least 2 characters')
    .max(50, 'Sub Sub Category name must be less than 50 characters'),
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
  parentId: Yup.string().required('Parent sub category is required'),
});

const SubSubCategoryForm = ({ onSuccess, onCancel }) => {
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
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Fetch all sub categories (level 1) for dropdown
  const fetchSubCategories = async () => {
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
      console.error('Error fetching sub categories:', error);
      toast.error('Failed to load sub categories');
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // Load sub categories on component mount
  useEffect(() => {
    fetchSubCategories();
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
      // eslint-disable-next-line no-unused-vars
      const { slug: _slug, image: _image, ...apiData } = formData;
      console.log('Sending data to API:', apiData); // Debug log
      const response = await categoryService.create(apiData);
      console.log('Sub Sub Category Created Response:', response);

      // Check for successful response (status 201 or 200)
      if (
        response?.status === 201 ||
        response?.status === 200 ||
        response?.data
      ) {
        console.log('Sub Sub Category Created Successfully:', response.data);
        toast.success('Sub Sub Category added successfully!');

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
          response?.data?.message || 'Failed to create sub sub category';
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
          error.response?.data?.message || 'Failed to add sub sub category';
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
    <>
      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <SelectField
            label="Sub Category"
            name="parentId"
            value={formData.parentId}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Sub Category' },
              ...subCategories.map((cat) => ({
                value: cat._id,
                label: cat.displayName,
              })),
            ]}
            error={formErrors?.parentId}
            disabled={loadingSubCategories}
          />

          <InputTextField
            label="Sub Sub Category Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter sub sub category name"
            error={formErrors?.name}
          />

          {loadingSubCategories && (
            <div className="sm:col-span-2 text-sm text-gray-500 text-center">
              Loading sub categories...
            </div>
          )}

          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter sub sub category description"
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
              {loading ? 'Adding...' : 'Add Sub Sub Category'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

SubSubCategoryForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SubSubCategoryForm;
