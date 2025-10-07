import React, { useState, useEffect } from 'react';
import { Button, InputTextField, SelectField } from '@/components';

function ProductVariant({ visible, variant, onSave, onClose }) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    mrp: 0,
    weight: 0,
    stock: 0,
    images: [],
    status: 'active',
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Load variant data if editing
  useEffect(() => {
    if (variant) {
      setFormData(variant);
    } else {
      setFormData({
        name: '',
        sku: '',
        price: 0,
        mrp: 0,
        weight: 0,
        stock: 0,
        images: [],
        status: 'active',
      });
    }
    setErrors({});
  }, [variant]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'name' || name === 'sku' || name === 'status'
          ? value
          : parseFloat(value) || 0,
    }));

    // Clear error for this field on change
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Validate and submit
  const handleSave = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Variant name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(formData);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96 max-h-[90vh] overflow-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Variant Details</h2>

        <InputTextField
          name="name"
          label="Variant Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Black 256GB"
          error={errors.name}
        />

        <InputTextField
          name="sku"
          label="SKU"
          value={formData.sku}
          onChange={handleChange}
          placeholder="Enter SKU"
          error={errors.sku}
        />

        <InputTextField
          name="price"
          label="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
        />

        <InputTextField
          name="mrp"
          label="MRP"
          type="number"
          value={formData.mrp}
          onChange={handleChange}
          placeholder="Enter MRP"
        />

        <InputTextField
          name="weight"
          label="Weight (kg)"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Weight"
        />

        <InputTextField
          name="stock"
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock quantity"
        />

        <SelectField
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductVariant;
