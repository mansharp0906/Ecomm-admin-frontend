import { Button, LoadingData, InputTextField, SelectField } from '@/components';
import React, { useState, useEffect, useCallback } from 'react';

import attributeService from '@/api/service/attributeService';
import categoryService from '@/api/service/categoryService';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  useValidation,
  attributeCreateSchema,
  attributeUpdateSchema,
} from '@/validations';
import ScrollContainer from '@/components/custom-scrollbar/ScrollContainer';

// Validation schemas are now imported from validations directory

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
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Use validation hook
  const validationSchema = isEditMode
    ? attributeUpdateSchema
    : attributeCreateSchema;
  const { errors, validate, clearErrors, setFieldError } = useValidation(
    validationSchema,
    {
      context: { displayType: formData.displayType },
    },
  );

  const fetchCategoryData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await attributeService.getById(categoryId);
      const data = response?.data?.data || response?.data;
      if (!data) {
        toast.error('Failed to load attribute');
        return;
      }

      const firstCategoryId =
        Array.isArray(data.categories) && data.categories.length > 0
          ? typeof data.categories[0] === 'object'
            ? data.categories[0]._id
            : data.categories[0]
          : '';

      setFormData((prev) => ({
        ...prev,
        name: data.name || '',
        values:
          Array.isArray(data.values) && data.values.length > 0
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
    clearErrors();

    try {
      // Prepare data for validation
      const validationData = {
        ...formData,
        id: isEditMode ? categoryId : undefined,
        categories: formData.parentId ? [formData.parentId] : [],
      };

      // Validate form data
      const isValid = await validate(validationData);
      if (!isValid) {
        setLoading(false);
        return;
      }

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
        toast.success(
          `Attribute ${isEditMode ? 'updated' : 'added'} successfully!`,
        );

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
        clearErrors();

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
        // Set errors using validation hook
        Object.keys(validationErrors).forEach((key) => {
          setFieldError(key, validationErrors[key]);
        });
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
        <ScrollContainer>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-4 rounded-lg shadow"
            // style={{ minHeight: '600px', overflowY: 'auto', height: '600px' }}
          >
            <SelectField
              label="Category"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              options={(() => [
                { value: '', label: 'Select Category' },
                ...categories.map((cat) => ({
                  value: cat._id,
                  label: cat.displayName,
                })),
              ])()}
              error={errors?.parentId}
              disabled={loadingCategories}
            />
            <InputTextField
              label="Attribute Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors?.name}
            />
            <SelectField
              label="Display Type"
              name="displayType"
              value={formData.displayType}
              onChange={handleChange}
              options={displayTypes}
              error={errors?.displayType}
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
                error={errors?.status}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Values</h3>
              {errors?.values && (
                <div className="text-red-600 text-sm">{errors.values}</div>
              )}
              {formData.values.map((val, idx) => (
                <div key={idx} className="flex gap-2">
                  <InputTextField
                    label="Value"
                    value={val.value}
                    onChange={(e) =>
                      handleValueChange(idx, 'value', e.target.value)
                    }
                    error={errors?.[`values.${idx}.value`]}
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
                      error={errors?.[`values.${idx}.image`]}
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
                    ? 'Update'
                    : 'Add'}
                </Button>
              </div>
            </div>
          </form>
        </ScrollContainer>
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
