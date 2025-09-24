import React, { useState } from 'react';
import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import attributeService from '@/api/service/attributeService';
import categoryService from '@/api/service/categoryService';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

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
  parentId: Yup.string().required('Parent category is required'),
  // isFeatured: Yup.boolean(),
});

const displayTypes = [
  { label: 'Color', value: 'color' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
];

const AttributeForm = ({ onSuccess, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    values: [{ value: '', color: '', image: '', isDefault: false }],
    isFilterable: false,
    isRequired: false,
    displayType: 'text',
    status: 'active',
    categories: [],
  });
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect(() => {
    if (isEditMode && categoryId && categories.length > 0) {
      fetchCategoryData();
    }
  }, [isEditMode, categoryId, fetchCategoryData, categories.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValueChange = (index, field, value) => {
    const updated = [...formData.values];
    updated[index][field] = value;
    setFormData({ ...formData, values: updated });
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        console.log('Full category tree response:', response.data);

        // Filter only Level 0 categories (main categories) for dropdown
        const mainCategories = response.data.filter((cat) => cat.level === 0);
        console.log('Main categories (Level 0):', mainCategories);

        const formattedCategories = mainCategories.map((cat) => ({
          ...cat,
          displayName: `${cat.name} (Level ${cat.level})`,
        }));

        setCategories(formattedCategories);
        console.log('Formatted categories for dropdown:', formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values: [
        ...formData.values,
        { value: '', color: '', image: '', isDefault: false },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });

      // Remove fields that backend doesn't allow
      const { image: _image, ...apiData } = formData;
      console.log('Sending data to API:', apiData); // Debug log

      let response;
      if (isEditMode) {
        response = await categoryService.update(categoryId, apiData);
      } else {
        response = attributeService.create(apiData);
      }
      console.log('Sub Category Response:', response);

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
          metaTitle: '',
          metaDescription: '',
          priority: 1,
          status: 'active',
          parentId: '',
          isFeatured: false,
        });
        setFormErrors({});

        // Notify parent component (this will trigger navigation)
        if (onSuccess) {
          onSuccess(response.data.data || response.data);
        }
      } else {
        toast.error('Failed to save sub category');
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
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} sub category`;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {isEditMode && loadingCategories ? (
        <LoadingData message="Loading data..." />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded-lg shadow"
        >
          <SelectField
            label="Category"
            name="parentId"
            value={formData.parentId}
            onChange={handleInputChange}
            options={(() => {
              console.log('Current formData.parentId:', formData.parentId);
              console.log('Available categories for dropdown:', categories);
              const options = [
                { value: '', label: 'Select Category' },
                ...categories.map((cat) => ({
                  value: cat._id,
                  label: cat.displayName,
                })),
              ];
              console.log('Dropdown options:', options);
              console.log(
                'Looking for parentId in options:',
                formData.parentId,
              );
              const foundOption = options.find(
                (opt) => opt.value === formData.parentId,
              );
              console.log('Found matching option:', foundOption);
              return options;
            })()}
            error={formErrors?.parentId}
            disabled={loadingCategories}
          />
          <InputTextField
            label="Attribute Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <SelectField
            label="Display Type"
            name="displayType"
            value={formData.displayType}
            onChange={handleChange}
            options={displayTypes}
          />

          <div className="space-y-3">
            <h3 className="font-semibold">Values</h3>
            {formData.values.map((val, idx) => (
              <div key={idx} className="flex gap-2">
                <InputTextField
                  label="Value"
                  value={val.value}
                  onChange={(e) =>
                    handleValueChange(idx, 'value', e.target.value)
                  }
                />
                {formData.displayType === 'color' && (
                  <input
                    type="color"
                    value={val.color}
                    onChange={(e) =>
                      handleValueChange(idx, 'color', e.target.value)
                    }
                  />
                )}
                {formData.displayType === 'image' && (
                  <InputTextField
                    label="Image URL"
                    value={val.image}
                    onChange={(e) =>
                      handleValueChange(idx, 'image', e.target.value)
                    }
                  />
                )}
                <label>
                  Default
                  <input
                    type="checkbox"
                    checked={val.isDefault}
                    onChange={(e) =>
                      handleValueChange(idx, 'isDefault', e.target.checked)
                    }
                  />
                </label>
              </div>
            ))}
            <Button type="button" onClick={addValue}>
              + Add Value
            </Button>
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
                  ? 'Update Sub Category'
                  : 'Add Sub Category'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
AttributeForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  isEditMode: PropTypes.bool,
};
export default AttributeForm;
