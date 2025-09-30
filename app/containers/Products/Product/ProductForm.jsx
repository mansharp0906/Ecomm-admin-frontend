import {
  Button,
  LoadingData,
  InputTextField,
  SelectField,
  TextAreaField,
  ScrollContainer,
  CheckboxField,
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
    slug: '', // Auto-generate from title
    description: '',
    shortDescription: '',
    sku: '', // Product level SKU
    barcode: '',
    brand: '',
    category: '',
    subCategory: '',
    thumbnail: '',
    images: ['', ''], // Multiple images
    attributes: [], // Product level attributes for filtering
    type: 'physical',
    unit: 'pcs',
    minOrderQty: 1,
    tax: 0,
    taxType: 'exclusive',
    shippingCost: 0,
    weight: '',
    length: '',
    width: '',
    height: '',
    status: 'draft', // Default to draft as per requirements
    featured: false,
    metaTitle: '',
    metaDescription: '',
    pdf: '',
    tags: '',
    variants: [], // Product variants array
  });

  const brandOptions = [
    { value: '', label: 'Select Brand' },
    { value: 'brand1', label: 'Brand One' },
    { value: 'brand2', label: 'Brand Two' },
  ];
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'category1', label: 'Category One' },
    { value: 'category2', label: 'Category Two' },
  ];
  const subCategoryOptions = [
    { value: '', label: 'Select Sub Category' },
    { value: 'subcategory1', label: 'Subcategory One' },
    { value: 'subcategory2', label: 'Subcategory Two' },
  ];
  const typeOptions = [
    { value: 'physical', label: 'Physical' },
    { value: 'digital', label: 'Digital' },
  ];
  const unitOptions = [
    { value: 'pcs', label: 'Pieces' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'litre', label: 'Litre' },
  ];
  const taxTypeOptions = [
    { value: 'inclusive', label: 'Inclusive' },
    { value: 'exclusive', label: 'Exclusive' },
  ];
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const validationSchema = isEditMode
    ? productUpdateSchema
    : productCreateSchema;
  const { errors, validate, clearErrors, setFieldError } =
    useValidation(validationSchema);

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    try {
      setIsLoadingData(true);
      const response = await productServices.getById(productId);
      if (typeof response?.data === 'string') {
        toast.error('Server error: API returned HTML instead of JSON');
        return;
      }
      const product = response?.data?.success
        ? response.data.data
        : response.data;
      if (product) {
        setFormData({
          title: product.title || '',
          slug: product.slug || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          brand: product.brand || '',
          category: product.category || '',
          subCategory: product.subCategory || '',
          thumbnail: product.thumbnail || '',
          images: product.images || ['', ''],
          attributes: product.attributes || [],
          type: product.type || 'physical',
          unit: product.unit || 'pcs',
          minOrderQty: product.minOrderQty || 1,
          tax: product.tax || 0,
          taxType: product.taxType || 'exclusive',
          shippingCost: product.shippingCost || 0,
          weight: product.weight || '',
          length: product.dimensions?.length || '',
          width: product.dimensions?.width || '',
          height: product.dimensions?.height || '',
          status: product.status || 'draft',
          featured: product.featured || false,
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          pdf: product.pdf || '',
          tags:
            product.tags && Array.isArray(product.tags)
              ? product.tags.join(', ')
              : '',
          variants: product.variants || [],
        });
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
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    if (name === 'images') {
      // For images array, handle differently if needed, else use index-based handlers outside
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // Helper for updating images array items
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      const validationData = {
        ...formData,
        id: isEditMode ? productId : undefined,
      };
      const isValid = await validate(validationData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Build payload matching expected API structure
      const apiPayload = {
        title: formData.title,
        slug:
          formData.slug ||
          formData.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''), // Auto-generate slug
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku || null,
        barcode: formData.barcode,
        thumbnail: formData.thumbnail,
        images: formData.images.filter((img) => img !== ''),
        brand: formData.brand,
        category: formData.category,
        subCategory: formData.subCategory,
        attributes: formData.attributes || [], // Product level attributes
        type: formData.type,
        unit: formData.unit,
        minOrderQty: formData.minOrderQty,
        tax: Number(formData.tax) || 0,
        taxType: formData.taxType,
        shippingCost: Number(formData.shippingCost) || 0,
        weight: Number(formData.weight) || 0,
        dimensions: {
          length: Number(formData.length) || 0,
          width: Number(formData.width) || 0,
          height: Number(formData.height) || 0,
        },
        status: formData.status,
        featured: formData.featured,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        pdf: formData.pdf,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : [],
        variants: formData.variants || [], // Product variants
      };

      let response;
      if (isEditMode) {
        response = await productServices.update(productId, apiPayload);
      } else {
        response = await productServices.create(apiPayload);
      }

      const isSuccess =
        response?.data?.success ||
        (response?.status >= 200 && response?.status < 300);

      if (isSuccess) {
        toast.success(
          `Product ${isEditMode ? 'updated' : 'added'} successfully!`,
        );
        setFormData({
          title: '',
          slug: '',
          description: '',
          shortDescription: '',
          sku: '',
          barcode: '',
          brand: '',
          category: '',
          subCategory: '',
          thumbnail: '',
          images: ['', ''],
          attributes: [],
          type: 'physical',
          unit: 'pcs',
          minOrderQty: 1,
          tax: 0,
          taxType: 'exclusive',
          shippingCost: 0,
          weight: '',
          length: '',
          width: '',
          height: '',
          status: 'draft',
          featured: false,
          metaTitle: '',
          metaDescription: '',
          pdf: '',
          tags: '',
          variants: [],
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
        Object.keys(validationErrors).forEach((key) =>
          setFieldError(key, validationErrors[key]),
        );
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
      slug: '',
      description: '',
      shortDescription: '',
      sku: '',
      barcode: '',
      brand: '',
      category: '',
      subCategory: '',
      thumbnail: '',
      images: ['', ''],
      attributes: [],
      type: 'physical',
      unit: 'pcs',
      minOrderQty: 1,
      tax: 0,
      taxType: 'exclusive',
      shippingCost: 0,
      weight: '',
      length: '',
      width: '',
      height: '',
      status: 'draft',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      pdf: '',
      tags: '',
      variants: [],
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
          <form
            onSubmit={handleSubmit}
            className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
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
            <InputTextField
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="Enter product SKU"
              error={errors?.sku}
            />
            <InputTextField
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              error={errors?.barcode}
            />
            <SelectField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              options={brandOptions}
              error={errors?.brand}
            />
            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categoryOptions}
              error={errors?.category}
            />
            <SelectField
              label="Sub Category"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              options={subCategoryOptions}
              error={errors?.subCategory}
            />
            <InputTextField
              label="Thumbnail URL"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              error={errors?.thumbnail}
            />

            {/* Images input for multiple images */}
            {formData.images.map((img, idx) => (
              <InputTextField
                key={idx}
                label={`Image URL ${idx + 1}`}
                name={`image-${idx}`}
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                error={errors?.images}
              />
            ))}

            <SelectField
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={typeOptions}
              error={errors?.type}
            />
            <SelectField
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              options={unitOptions}
              error={errors?.unit}
            />
            <InputTextField
              label="Min Order Quantity"
              name="minOrderQty"
              value={formData.minOrderQty}
              onChange={handleInputChange}
              error={errors?.minOrderQty}
              type="number"
            />
            <InputTextField
              label="Tax"
              name="tax"
              value={formData.tax}
              onChange={handleInputChange}
              error={errors?.tax}
              type="number"
            />
            <SelectField
              label="Tax Type"
              name="taxType"
              value={formData.taxType}
              onChange={handleInputChange}
              options={taxTypeOptions}
              error={errors?.taxType}
            />
            <InputTextField
              label="Shipping Cost"
              name="shippingCost"
              value={formData.shippingCost}
              onChange={handleInputChange}
              error={errors?.shippingCost}
              type="number"
            />
            <InputTextField
              label="Weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              error={errors?.weight}
              type="number"
            />
            <InputTextField
              label="Length"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              error={errors?.length}
              type="number"
            />
            <InputTextField
              label="Width"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              error={errors?.width}
              type="number"
            />
            <InputTextField
              label="Height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              error={errors?.height}
              type="number"
            />
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              error={errors?.status}
            />
            <InputTextField
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              error={errors?.metaTitle}
            />
            <TextAreaField
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={2}
              error={errors?.metaDescription}
            />
            <InputTextField
              label="PDF URL"
              name="pdf"
              value={formData.pdf}
              onChange={handleInputChange}
              error={errors?.pdf}
            />
            <InputTextField
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              error={errors?.tags}
            />

            <CheckboxField
              label="Featured"
              name="featured"
              value={formData.featured}
              onChange={handleInputChange}
              error={errors?.featured}
              description="Mark this product as featured"
            />

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
                disabled={loading}
                className="px-8"
              >
                {loading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Adding...'
                  : isEditMode
                  ? 'Update Product'
                  : 'Add Product'}
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
