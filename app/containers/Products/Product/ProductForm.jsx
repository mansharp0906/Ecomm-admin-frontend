import {
  Button,
  LoadingData,
  InputTextField,
  SelectField,
  TextAreaField,
  ScrollContainer,
} from '@/components';
import productServices from '@/api/service/productServices';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  useValidation,
  productCreateSchema,
  productUpdateSchema,
} from '@/validations';

const ProductForm = ({ onSuccess, onCancel, productId, isEditMode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    barcode: '',
    brand: '',
    category: '',
    subCategory: '',
    sku: '',
    price: '',
    mrp: '',
    weight: '',
    stock: '',
    image: '',
    attribute: '',
    value: '',
    thumbnail: '',
    unit: '',
    type: '',
    taxType: '',
    tax: '',
    minOrderQty: '',
    shippingCost: '',
    length: '',
    width: '',
    height: '',
    store: '',
    threshold: '',
    visible: '',
    status: 'active',
    featured: '',
    metaTitle: '',
    metaDescription: '',
    tags: '',
    createdBy: '',
    pdf: '',
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const validationSchema = isEditMode ? productUpdateSchema : productCreateSchema;
  const { errors, validate, clearErrors, setFieldError } = useValidation(validationSchema);

  const fetchProductData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await productServices.getById(productId);

      if (typeof response?.data === 'string') {
        toast.error('Server error: API returned HTML instead of JSON');
        return;
      }

      let product;
      if (response?.data?.success) {
        product = response.data.data;
      } else if (response?.data) {
        product = response.data;
      } else {
        toast.error('Failed to fetch product data');
        return;
      }

      if (product) {
        const newFormData = {
          title: product.title || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          barcode: product.barcode || '',
          brand: product.brand || '',
          category: product.category || '',
          subCategory: product.subCategory || '',
          sku: product.sku || '',
          price: product.price || '',
          mrp: product.mrp || '',
          weight: product.weight || '',
          stock: product.stock || '',
          image: product.image || '',
          attribute: product.attribute || '',
          value: product.value || '',
          thumbnail: product.thumbnail || '',
          unit: product.unit || '',
          type: product.type || '',
          taxType: product.taxType || '',
          tax: product.tax || '',
          minOrderQty: product.minOrderQty || '',
          shippingCost: product.shippingCost || '',
          length: product.length || '',
          width: product.width || '',
          height: product.height || '',
          store: product.store || '',
          threshold: product.threshold || '',
          visible: product.visible || '',
          status: product.status || 'active',
          featured: product.featured || '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          tags: product.tags || '',
          createdBy: product.createdBy || '',
          pdf: product.pdf || '',
        };
        setFormData(newFormData);
      } else {
        toast.error('No product data found');
      }
    } catch (error) {
      if (error.message.includes('Unexpected token')) {
        toast.error('Server returned invalid response format');
      } else {
        toast.error('Failed to fetch product data: ' + error.message);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [productId]);

  useEffect(() => {
    if (isEditMode && productId) fetchProductData();
  }, [isEditMode, productId, fetchProductData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      const validationData = { ...formData, id: isEditMode ? productId : undefined };
      const isValid = await validate(validationData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      const { image: _image, ...apiData } = formData; // Optionally exclude or modify fields before sending

      let response;
      if (isEditMode) {
        response = await productServices.update(productId, apiData);
      } else {
        response = await productServices.create(apiData);
      }

      const isSuccess = response?.data?.success || (response?.status >= 200 && response?.status < 300);

      if (isSuccess) {
        toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
        setFormData({
          title: '',
          description: '',
          shortDescription: '',
          barcode: '',
          brand: '',
          category: '',
          subCategory: '',
          sku: '',
          price: '',
          mrp: '',
          weight: '',
          stock: '',
          image: '',
          attribute: '',
          value: '',
          thumbnail: '',
          unit: '',
          type: '',
          taxType: '',
          tax: '',
          minOrderQty: '',
          shippingCost: '',
          length: '',
          width: '',
          height: '',
          store: '',
          threshold: '',
          visible: '',
          status: 'active',
          featured: '',
          metaTitle: '',
          metaDescription: '',
          tags: '',
          createdBy: '',
          pdf: '',
        });
        clearErrors();
        if (onSuccess) onSuccess(response.data.data || response.data);
      } else {
        toast.error('Failed to save product');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        Object.keys(validationErrors).forEach((key) => setFieldError(key, validationErrors[key]));
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      barcode: '',
      brand: '',
      category: '',
      subCategory: '',
      sku: '',
      price: '',
      mrp: '',
      weight: '',
      stock: '',
      image: '',
      attribute: '',
      value: '',
      thumbnail: '',
      unit: '',
      type: '',
      taxType: '',
      tax: '',
      minOrderQty: '',
      shippingCost: '',
      length: '',
      width: '',
      height: '',
      store: '',
      threshold: '',
      visible: '',
      status: 'active',
      featured: '',
      metaTitle: '',
      metaDescription: '',
      tags: '',
      createdBy: '',
      pdf: '',
    });
    clearErrors();
    if (onCancel) onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {isEditMode && isLoadingData ? (
        <LoadingData message="Loading data..." size="50px" />
      ) : (
        <ScrollContainer>
          <form onSubmit={handleSubmit} className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputTextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              error={errors?.title}
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={2}
              error={errors?.description}
              className="sm:col-span-2"
            />
            <TextAreaField
              label="Short Description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Enter short description"
              rows={2}
              error={errors?.shortDescription}
            />
            <InputTextField label="Barcode" name="barcode" value={formData.barcode} onChange={handleInputChange} error={errors?.barcode} />
            <InputTextField label="Brand" name="brand" value={formData.brand} onChange={handleInputChange} error={errors?.brand} />
            <InputTextField label="Category" name="category" value={formData.category} onChange={handleInputChange} error={errors?.category} />
            <InputTextField label="Sub Category" name="subCategory" value={formData.subCategory} onChange={handleInputChange} error={errors?.subCategory} />
            <InputTextField label="SKU" name="sku" value={formData.sku} onChange={handleInputChange} error={errors?.sku} />
            <InputTextField label="Price" name="price" value={formData.price} onChange={handleInputChange} error={errors?.price} />
            <InputTextField label="MRP" name="mrp" value={formData.mrp} onChange={handleInputChange} error={errors?.mrp} />
            <InputTextField label="Weight" name="weight" value={formData.weight} onChange={handleInputChange} error={errors?.weight} />
            <InputTextField label="Stock" name="stock" value={formData.stock} onChange={handleInputChange} error={errors?.stock} />
            <InputTextField label="Image URL" name="image" value={formData.image} onChange={handleInputChange} error={errors?.image} />
            <InputTextField label="Attribute" name="attribute" value={formData.attribute} onChange={handleInputChange} error={errors?.attribute} />
            <InputTextField label="Value" name="value" value={formData.value} onChange={handleInputChange} error={errors?.value} />
            <InputTextField label="Thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} error={errors?.thumbnail} />
            <InputTextField label="Unit" name="unit" value={formData.unit} onChange={handleInputChange} error={errors?.unit} />
            <InputTextField label="Type" name="type" value={formData.type} onChange={handleInputChange} error={errors?.type} />
            <InputTextField label="Tax Type" name="taxType" value={formData.taxType} onChange={handleInputChange} error={errors?.taxType} />
            <InputTextField label="Tax" name="tax" value={formData.tax} onChange={handleInputChange} error={errors?.tax} />
            <InputTextField label="Min Order Quantity" name="minOrderQty" value={formData.minOrderQty} onChange={handleInputChange} error={errors?.minOrderQty} />
            <InputTextField label="Shipping Cost" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange} error={errors?.shippingCost} />
            <InputTextField label="Length" name="length" value={formData.length} onChange={handleInputChange} error={errors?.length} />
            <InputTextField label="Width" name="width" value={formData.width} onChange={handleInputChange} error={errors?.width} />
            <InputTextField label="Height" name="height" value={formData.height} onChange={handleInputChange} error={errors?.height} />
            <InputTextField label="Store" name="store" value={formData.store} onChange={handleInputChange} error={errors?.store} />
            <InputTextField label="Threshold" name="threshold" value={formData.threshold} onChange={handleInputChange} error={errors?.threshold} />
            <InputTextField label="Visible" name="visible" value={formData.visible} onChange={handleInputChange} error={errors?.visible} />
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
            <InputTextField label="Featured" name="featured" value={formData.featured} onChange={handleInputChange} error={errors?.featured} />
            <InputTextField label="Meta Title" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} error={errors?.metaTitle} />
            <TextAreaField label="Meta Description" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={2} error={errors?.metaDescription} />
            <InputTextField label="Tags" name="tags" value={formData.tags} onChange={handleInputChange} error={errors?.tags} />
            <InputTextField label="Created By" name="createdBy" value={formData.createdBy} onChange={handleInputChange} error={errors?.createdBy} />
            <InputTextField label="PDF" name="pdf" value={formData.pdf} onChange={handleInputChange} error={errors?.pdf} />

            <div className="sm:col-span-2 flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={handleCancel} className="px-8">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="px-8">
                {loading ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </ScrollContainer>
      )}
    </div>
  );
};

ProductForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  productId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export default ProductForm;
