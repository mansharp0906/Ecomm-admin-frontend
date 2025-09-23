import React, { useState } from 'react';
import { Button } from '@/components/custom-button';
import InputTextField from '@/components/custom-input-field/InputTextField';
import SelectField from '@/components/custom-forms/SelectField';
import { toast } from 'react-toastify';

// Initial empty color value template
const emptyColorValue = {
  value: '',
  color: '#000000',
  image: null,
  isDefault: false,
};

const AttributeForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    values: [emptyColorValue],
    isFilterable: true,
    isRequired: false,
    displayType: 'color',
    status: 'active',
    categories: [],
  });

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle changes to a specific color value inside the values array
  const handleColorValueChange = (index, field, value) => {
    const newValues = [...formData.values];
    newValues[index] = {
      ...newValues[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      values: newValues,
    }));
  };

  // Add a new color value
  const addColorValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, emptyColorValue],
    }));
  };

  // Remove a color value by index
  const removeColorValue = (index) => {
    const newValues = formData.values.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      values: newValues,
    }));
  };

  // Handle form submit (basic validation can be added)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation: name and at least one value with 'value' filled
    if (!formData.name.trim()) {
      toast.error('Attribute name is required');
      return;
    }
    if (formData.values.length === 0 || formData.values.some(v => !v.value.trim())) {
      toast.error('All color values must have a name');
      return;
    }
    // Call onSuccess with formData for further processing (e.g., API call)
    if (onSuccess) onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Attribute</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputTextField
            label="Attribute Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Color"
            required
          />
          <div>
            <label className="block font-medium mb-2">Values</label>
            {formData.values.map((val, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Value name (e.g. Black)"
                  className="border rounded px-2 py-1 flex-1"
                  value={val.value}
                  onChange={(e) =>
                    handleColorValueChange(index, 'value', e.target.value)
                  }
                  required
                />
                <input
                  type="color"
                  value={val.color}
                  onChange={(e) =>
                    handleColorValueChange(index, 'color', e.target.value)
                  }
                />
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={val.isDefault}
                    onChange={(e) => {
                      // Toggle isDefault for this value and uncheck others
                      const newValues = formData.values.map((v, i) => ({
                        ...v,
                        isDefault: i === index ? e.target.checked : false,
                      }));
                      setFormData((prev) => ({ ...prev, values: newValues }));
                    }}
                  />
                  <span>Default</span>
                </label>
                {formData.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColorValue(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addColorValue} variant="secondary">
              Add Value
            </Button>
          </div>

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFilterable"
                checked={formData.isFilterable}
                onChange={handleInputChange}
              />
              <span>Filterable</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isRequired"
                checked={formData.isRequired}
                onChange={handleInputChange}
              />
              <span>Required</span>
            </label>
          </div>

          <SelectField
            label="Display Type"
            name="displayType"
            value={formData.displayType}
            onChange={handleInputChange}
            options={[
              { value: 'color', label: 'Color' },
              { value: 'text', label: 'Text' },
              { value: 'image', label: 'Image' },
            ]}
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
          />

          {/* Categories can be a multi-select if needed, assuming categoryService provides options */}
          {/* For simplicity, using text input here */}
          <InputTextField
            label="Categories (comma separated IDs)"
            name="categories"
            value={formData.categories.join(', ')}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                categories: e.target.value
                  .split(',')
                  .map((id) => id.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="e.g. 68c91e289323da2733bb50c0, 68c91f029323da2733bb50c3"
          />

          <div className="flex space-x-4 justify-end">
            <Button variant="secondary" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Attribute
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttributeForm;
