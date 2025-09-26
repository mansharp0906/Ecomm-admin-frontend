import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import attributeService from '@/api/service/attributeService';
import categoryService from '@/api/service/categoryService';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import { LoadingData } from '@/components/custom-pages';
=======
import * as Yup from 'yup';
>>>>>>> pallavidev

import { toast } from 'react-toastify';
import LoadingData from '@/components/custom-pages/LoadingData';

// Validation schema for Attribute payload
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Attribute name is required')
    .min(2, 'Attribute name must be at least 2 characters')
    .max(50, 'Attribute name must be less than 50 characters'),
<<<<<<< HEAD
  priority: Yup.number()
    .required('Priority is required')
    .min(1, 'Priority must be at least 1')
    .max(100, 'Priority must be less than 100')
    .integer('Priority must be a whole number'),
=======
  displayType: Yup.string()
    .required('Display type is required')
    .oneOf(['color', 'text', 'image'], 'Invalid display type'),
  isFilterable: Yup.boolean().required(),
  isRequired: Yup.boolean().required(),
>>>>>>> pallavidev
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive'),
  parentId: Yup.string().trim().required('Category is required'),
  values: Yup.array()
    .of(
      Yup.object({
        value: Yup.string().trim().required('Value is required'),
        color: Yup.string().when('$displayType', {
          is: 'color',
          then: (schema) => schema.required('Color is required for color type'),
          otherwise: (schema) => schema.notRequired(),
        }),
        image: Yup.string()
          .url('Please enter a valid URL')
          .when('$displayType', {
            is: 'image',
            then: (schema) => schema.required('Image URL is required for image type'),
            otherwise: (schema) => schema.notRequired().nullable(),
          }),
        isDefault: Yup.boolean().required(),
      }),
    )
    .min(1, 'Add at least one value')
    .required('Values are required'),
});

const displayTypes = [
  { label: 'Color', value: 'color' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
];

const AttributeForm = ({ onSuccess, onCancel, categoryId, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    values: [{ value: '', color: '', image: '', isDefault: false }],
    isFilterable: false,
    isRequired: false,
    displayType: 'text',
    status: 'active',
    categories: [],
    parentId: '',
  });
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const fetchCategoryData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await attributeService.getById(categoryId);
      const data = response?.data?.data || response?.data;
      if (!data) {
        toast.error('Failed to load attribute');
        return;
      }

      const firstCategoryId = Array.isArray(data.categories) && data.categories.length > 0
        ? (typeof data.categories[0] === 'object' ? data.categories[0]._id : data.categories[0])
        : '';

      setFormData((prev) => ({
        ...prev,
        name: data.name || '',
        values: Array.isArray(data.values) && data.values.length > 0
          ? data.values.map((v) => ({
              value: v.value || '',
              color: v.color || '',
              image: v.image || '',
              isDefault: Boolean(v.isDefault),
            }))
          : [{ value: '', color: '', image: '', isDefault: false }],
        isFilterable: Boolean(data.isFilterable),
        isRequired: Boolean(data.isRequired),
        displayType: data.displayType || 'text',
        status: data.status || 'active',
        parentId: firstCategoryId,
      }));
    } catch (err) {
      console.error('Failed to fetch attribute by id:', err);
      toast.error('Failed to load attribute');
    } finally {
      setIsLoadingData(false);
    }
  }, [categoryId]);

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

 const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value,
  });
};


  useEffect(() => {
    // Load category options on mount
    fetchCategories();
  }, []);

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
      // Validate form data with context for conditional fields
      await validationSchema.validate(formData, {
        abortEarly: false,
        context: { displayType: formData.displayType },
      });

      const apiData = {
        name: formData.name,
        values: formData.values,
        isFilterable: formData.isFilterable,
        isRequired: formData.isRequired,
        displayType: formData.displayType,
        status: formData.status,
        categories: formData.parentId ? [formData.parentId] : [],
      };

      let response;
      if (isEditMode && categoryId) {
        response = await attributeService.update(categoryId, apiData);
      } else {
        response = await attributeService.create(apiData);
      }

      const isSuccess =
        response?.data?.success ||
        (response?.status >= 200 && response?.status < 300);

      if (isSuccess) {
        toast.success(`Attribute ${isEditMode ? 'updated' : 'added'} successfully!`);

        // Reset form for both create and edit modes
        setFormData({
          name: '',
          values: [{ value: '', color: '', image: '', isDefault: false }],
          isFilterable: false,
          isRequired: false,
          displayType: 'text',
          status: 'active',
          categories: [],
          parentId: '',
        });
        setFormErrors({});

        // Notify parent component (this will trigger navigation)
        if (onSuccess) {
          onSuccess(response.data.data || response.data);
        }
      } else {
        toast.error('Failed to save attribute');
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
      } else {
        // Handle other API errors
        const errorMessage =
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} attribute`;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {isEditMode && (loadingCategories || isLoadingData) ? (
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
            options={(() => [
              { value: '', label: 'Select Category' },
              ...categories.map((cat) => ({ value: cat._id, label: cat.displayName })),
            ])()}
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

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFilterable"
                checked={formData.isFilterable}
                onChange={handleInputChange}
              />
              <span>Filterable</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isRequired"
                checked={formData.isRequired}
                onChange={handleInputChange}
              />
              <span>Required</span>
            </label>
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </div>

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
                  ? 'Update Attribute'
                  : 'Add Attribute'}
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
