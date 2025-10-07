import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  LoadingData,
  InputTextField,
  SelectField,
  TextAreaField,
  ScrollContainer,
  CheckboxField,
} from '@/components';
import FileUploadButton from '@/components/custom-fileuplode/FileUploadButton';
import productServices from '@/api/service/productServices';
import categoryService from '@/api/service/categoryService';
import brandService from '@/api/service/brandService';
import {
  buildProductPayload,
  handleMultipleFileUpload,
  handleInputChange as utilHandleInputChange,
  removeFileFromUpload,
} from '@/utils';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  useValidation,
  productCreateSchema,
  productUpdateSchema,
} from '@/validations';
import { Plus, Trash2, X } from 'lucide-react';
import ProductVariant from './ProductVariant';

const ProductForm = ({ onSuccess, onCancel, productId, isEditMode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    sku: '',
    brand: '',
    category: '',
    subCategory: '',
    thumbnail: '',
    thumbnailFile: null,
    images: [],
    imagesPreview: [],
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
    status: 'active',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    pdf: '',
    pdfFile: null,
    tags: [],
    variants: [],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Variant modal state management
  const [ProductVariantVisible, setProductVariantVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

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
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const validationSchema = isEditMode
    ? productUpdateSchema
    : productCreateSchema;
  const { errors, validate, clearErrors, setFieldError, clearFieldError } =
    useValidation(validationSchema);

  const fetchSubCategories = useCallback(async (categoryId) => {
    setLoadingSubCategories(true);
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        const allSubCategories = [];
        const extractSubCategories = (cats) => {
          cats.forEach((cat) => {
            if (cat.children && cat.children.length) {
              const level1 = cat.children.filter((c) => c.level === 1);
              if (level1.length) allSubCategories.push(...level1);
              extractSubCategories(cat.children);
            }
          });
        };
        extractSubCategories(response.data);
        const filtered = categoryId
          ? allSubCategories.filter(
              (sc) =>
                sc.parentId === categoryId ||
                (sc.parent && sc.parent._id === categoryId),
            )
          : allSubCategories;
        setSubCategories(
          filtered.map((c) => ({
            ...c,
            displayName: `${c.name} (Sub Category)`,
          })),
        );
      }
    } catch {
      toast.error('Failed to load sub-categories');
    } finally {
      setLoadingSubCategories(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    utilHandleInputChange(e, setFormData, clearFieldError, {
      clearRelatedFields: name === 'category' ? ['subCategory'] : [],
    });
    if (name === 'category') {
      fetchSubCategories(value);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImagesChange = (e) => {
    if (e.target.files) {
      handleMultipleFileUpload(e.target.files, setFormData, 'images', {
        clearErrors: clearFieldError,
        preventDuplicates: true,
        maxFiles: 10,
      });
      const previewUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setFormData((prev) => ({
        ...prev,
        imagesPreview: [...prev.imagesPreview, ...previewUrls],
      }));
      e.target.value = '';
    }
  };

  const removeImagePreview = (index) => {
    setFormData((prev) => ({
      ...prev,
      imagesPreview: prev.imagesPreview.filter((_, i) => i !== index),
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openAddProductVariant = () => {
    setEditingVariant(null);
    setProductVariantVisible(true);
  };

  const openEditProductVariant = (variant) => {
    setEditingVariant(variant);
    setProductVariantVisible(true);
  };

  const saveVariant = (variant) => {
    setFormData((prev) => {
      if (editingVariant) {
        const newVariants = prev.variants.map((v) =>
          v.sku === editingVariant.sku ? variant : v,
        );
        return { ...prev, variants: newVariants };
      } else {
        return { ...prev, variants: [...prev.variants, variant] };
      }
    });
    setProductVariantVisible(false);
  };

  const deleteVariant = (sku) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.sku !== sku),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();
    try {
      const isValid = await validate({
        ...formData,
        id: isEditMode ? productId : undefined,
      });
      if (!isValid) {
        setLoading(false);
        return;
      }
      const payload = buildProductPayload(
        {
          ...formData,
          brand: { $oid: formData.brand },
          category: { $oid: formData.category },
          subCategory: { $oid: formData.subCategory },
          dimensions: {
            length: Number(formData.length) || 0,
            width: Number(formData.width) || 0,
            height: Number(formData.height) || 0,
          },
          tags: formData.tags.filter((t) => t.trim() !== ''),
          variants: formData.variants,
        },
        { customFields: { createdBy: '651fa9f9eabf0f001fc6a826' } },
      );

      let response;
      if (isEditMode) {
        response = await productServices.update(productId, payload);
      } else {
        response = await productServices.create(payload);
      }
      if (
        response?.data?.success ||
        (response.status >= 200 && response.status < 300)
      ) {
        toast.success(
          `Product ${isEditMode ? 'updated' : 'added'} successfully!`,
        );
        setFormData({
          title: '',
          description: '',
          shortDescription: '',
          sku: '',
          brand: '',
          category: '',
          subCategory: '',
          thumbnail: '',
          images: [],
          imagesPreview: [],
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
          status: 'active',
          featured: false,
          metaTitle: '',
          metaDescription: '',
          pdf: '',
          pdfFile: null,
          tags: [],
          variants: [],
        });
        clearErrors();
        if (onSuccess) onSuccess(response.data.data || response.data);
      } else {
        toast.error('Failed to save product');
      }
    } catch (error) {
      toast.error(`Error: ${error.message || error.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      sku: '',
      brand: '',
      category: '',
      subCategory: '',
      thumbnail: '',
      images: [],
      imagesPreview: [],
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
      status: 'active',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      pdf: '',
      pdfFile: null,
      tags: [],
      variants: [],
    });
    clearErrors();
    if (onCancel) onCancel();
  };

  return (
    <div>
      {(isEditMode && isLoadingData) || loadingCategories || loadingBrands ? (
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
              placeholder="Enter SKU"
              error={errors?.sku}
            />
            <SelectField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Brand' },
                ...brands.map((b) => ({ value: b._id, label: b.displayName })),
              ]}
              error={errors?.brand}
              disabled={loadingBrands}
            />
            <SelectField
              label="Category"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              options={(() => {
                const options = [
                  { value: '', label: 'Select Category' },
                  ...categories.map((cat) => ({
                    value: cat._id,
                    label: cat.displayName,
                  })),
                ];
                return options;
              })()}
              error={errors?.parentId}
              disabled={loadingCategories}
            />
            <SelectField
              label="Sub Category"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Sub Category' },
                ...subCategories.map((c) => ({
                  value: c._id,
                  label: c.displayName,
                })),
              ]}
              error={errors?.subCategory}
              disabled={loadingSubCategories}
            />

            <SelectField
              label="Shop"
              name="Shop"
              value={formData.subCategory}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Shop' },
                ...subCategories.map((c) => ({
                  value: c._id,
                  label: c.displayName,
                })),
              ]}
              error={errors?.subCategory}
              disabled={loadingSubCategories}
            />
            <SelectField
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={typeOptions}
              error={errors?.type}
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
              error={errors?.status}
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

            <FileUploadButton
              label="Product PDF"
              id="pdf"
              accept=".pdf"
              onChange={() => {}}
              onFileSelect={() => {}}
              showPreview={false}
              error={errors?.pdf}
            />
            <InputTextField
              label="PDF URL (Alternative)"
              name="pdf"
              value={formData.pdf}
              onChange={handleInputChange}
              error={errors?.pdf}
              placeholder="Or enter PDF URL directly"
            />
            {/* Variants Section */}
            <div className="sm:col-span-2">
              <h2 className=" font-bold mb-2">Variants</h2>
              <Button
                onClick={openAddProductVariant}
                className="mb-4 flex items-center gap-2"
              >
                <Plus /> Add Variant
              </Button>

              {formData.variants.length === 0 && (
                <p className="text-gray-500 mb-4">No variants added yet.</p>
              )}

              <ul>
                {formData.variants.map((v) => (
                  <li
                    key={v.sku}
                    className="flex justify-between items-center p-3 border rounded mb-3"
                  >
                    <div>
                      <strong>{v.name || v.sku}</strong> - ₹{v.price} - Stock:{' '}
                      {v.stock} - Status: {v.status}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditProductVariant(v)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteVariant(v.sku)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tags Input */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>

              {/* Input + Button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="Type a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Tag List */}
              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-500 hover:text-red-500"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <CheckboxField
              label="Featured"
              name="featured"
              value={formData.featured}
              onChange={handleInputChange}
              error={errors?.featured}
              description="Mark this product as featured"
            />
            <ProductVariant
              visible={ProductVariantVisible}
              variant={editingVariant}
              onSave={(variant) => {
                saveVariant(variant);
                setEditingVariant(null);
              }}
              onClose={() => {
                setProductVariantVisible(false);
                setEditingVariant(null);
              }}
            />
            {/* Submit and Cancel buttons */}
            <div className="sm:col-span-2 flex justify-end space-x-4 pt-4 border-t mt-4">
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
