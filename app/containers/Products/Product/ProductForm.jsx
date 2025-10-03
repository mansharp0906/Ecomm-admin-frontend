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
    thumbnailFile: null, // Store the actual file for upload
    images: [], // Multiple image files
    imagesPreview: [], // Preview URLs for display
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
  const { errors, validate, clearErrors, setFieldError, clearFieldError } =
    useValidation(validationSchema);

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

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
        const newFormData = {
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
          images: [], // Will be populated from file uploads
          imagesPreview: [], // Will be populated from file uploads
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
        };
        
        setFormData(newFormData);
        
        // If product has a category, fetch its sub-categories
        if (newFormData.category) {
          fetchSubCategories(newFormData.category);
        }
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

  // Fetch all categories for dropdown
  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        // Filter only Level 0 categories (main categories) for dropdown
        const mainCategories = response.data.filter((cat) => cat.level === 0);

        const formattedCategories = mainCategories.map((cat) => ({
          ...cat,
          displayName: `${cat.name} (Level ${cat.level})`,
        }));

        setCategories(formattedCategories);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Fetch all sub-categories and filter based on selected category
  const fetchSubCategories = useCallback(async (categoryId) => {
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

        // If a category is selected, filter sub-categories that belong to that category
        let filteredSubCategories = allSubCategories;
        if (categoryId) {
          filteredSubCategories = allSubCategories.filter(subCat => 
            subCat.parentId === categoryId || 
            (subCat.parent && subCat.parent._id === categoryId)
          );
        }

        const formattedSubCategories = filteredSubCategories.map((cat) => ({
          ...cat,
          displayName: `${cat.name} (Sub Category)`,
        }));

        setSubCategories(formattedSubCategories);
      }
    } catch (error) {
      toast.error('Failed to load sub-categories');
    } finally {
      setLoadingSubCategories(false);
    }
  }, []);

  // Fetch all brands for dropdown
  const fetchBrands = useCallback(async () => {
    setLoadingBrands(true);
    try {
      const response = await brandService.getAll({ status: 'active' });
      if (response?.data) {
        let brandsData = [];
        
        // Handle different response structures
        if (response.data.success && response.data.data) {
          brandsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          brandsData = response.data;
        }

        const formattedBrands = brandsData.map((brand) => ({
          ...brand,
          displayName: brand.name,
        }));

        setBrands(formattedBrands);
      }
    } catch (error) {
      toast.error('Failed to load brands');
    } finally {
      setLoadingBrands(false);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && productId) fetchProductData();
  }, [isEditMode, productId, fetchProductData]);

  // Load categories, sub-categories, and brands on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories(); // Load all sub-categories initially
    fetchBrands(); // Load all brands
  }, [fetchCategories, fetchSubCategories, fetchBrands]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    if (name === 'images') {
      // For images array, handle differently if needed, else use index-based handlers outside
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: val }));
    
    // Clear field error when user starts typing/selecting
    if (errors[name] && val && val.toString().trim() !== '') {
      clearFieldError(name);
    }
    
    // If category is changed, fetch sub-categories and reset sub-category selection
    if (name === 'category') {
      fetchSubCategories(val);
      setFormData((prev) => ({ ...prev, subCategory: '' }));
      // Don't clear sub-category error automatically - let user select sub-category first
    }
  };

  // Helper for updating images array items (removed - now using file upload)

  // Handle thumbnail file upload
  const handleThumbnailChange = (e) => {
    // This is called when file input changes
  };

  const handleThumbnailSelect = (file) => {
    if (file) {
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      
      // Update form data with the file and preview URL
      setFormData((prev) => ({ 
        ...prev, 
        thumbnail: previewUrl,
        thumbnailFile: file // Store the actual file for upload
      }));
      
      // Clear any thumbnail errors
      if (errors?.thumbnail) {
        clearFieldError('thumbnail');
      }
    }
  };

  // Handle multiple images file upload
  const handleImagesChange = (e) => {
    // Handle multiple file selection
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Add new files to existing files instead of replacing
      setFormData((prev) => {
        const existingFiles = prev.images || [];
        const existingPreviews = prev.imagesPreview || [];
        
        // Filter out duplicate files by name and size
        const uniqueNewFiles = newFiles.filter(newFile => 
          !existingFiles.some(existingFile => 
            existingFile.name === newFile.name && existingFile.size === newFile.size
          )
        );
        
        if (uniqueNewFiles.length === 0) {
          // No new unique files, reset input value
          e.target.value = '';
          return prev;
        }
        
        const allFiles = [...existingFiles, ...uniqueNewFiles];
        const newPreviews = uniqueNewFiles.map(file => URL.createObjectURL(file));
        const allPreviews = [...existingPreviews, ...newPreviews];
        
        // Reset input value to allow selecting same file again
        e.target.value = '';
        
        return {
          ...prev,
          images: allFiles,
          imagesPreview: allPreviews
        };
      });
      
      // Clear any images errors
      if (errors?.images) {
        clearFieldError('images');
      }
    }
  };

  const handleImagesSelect = (files) => {
    if (files && files.length > 0) {
      // Ensure files is an array
      const newFiles = Array.isArray(files) ? files : [files];
      
      // Add new files to existing files instead of replacing
      setFormData((prev) => {
        const existingFiles = prev.images || [];
        const existingPreviews = prev.imagesPreview || [];
        
        // Filter out duplicate files by name and size
        const uniqueNewFiles = newFiles.filter(newFile => 
          !existingFiles.some(existingFile => 
            existingFile.name === newFile.name && existingFile.size === newFile.size
          )
        );
        
        if (uniqueNewFiles.length === 0) {
          // No new unique files
          return prev;
        }
        
        const allFiles = [...existingFiles, ...uniqueNewFiles];
        const newPreviews = uniqueNewFiles.map(file => URL.createObjectURL(file));
        const allPreviews = [...existingPreviews, ...newPreviews];
        
        return {
          ...prev,
          images: allFiles,
          imagesPreview: allPreviews
        };
      });
      
      // Clear any images errors
      if (errors?.images) {
        clearFieldError('images');
      }
    }
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
      // If we have any files (thumbnail or images), we need to use FormData
      const hasFileUpload = formData.thumbnailFile || (formData.images && formData.images.length > 0);
      
      let apiPayload;
      if (hasFileUpload) {
        // Use FormData for file uploads
        apiPayload = new FormData();
        apiPayload.append('title', formData.title || '');
        apiPayload.append('slug', formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        apiPayload.append('description', String(formData.description || ''));
        apiPayload.append('shortDescription', String(formData.shortDescription || ''));
        // Handle SKU - only append if not empty to avoid duplicate null values
        if (formData.sku && formData.sku.trim() !== '') {
          apiPayload.append('sku', String(formData.sku));
        }
        // Handle barcode - only append if not empty to avoid duplicate empty strings
        if (formData.barcode && formData.barcode.trim() !== '') {
          apiPayload.append('barcode', String(formData.barcode));
        }
        apiPayload.append('thumbnail', formData.thumbnailFile); // Append the actual file
        apiPayload.append('brand', formData.brand);
        apiPayload.append('category', formData.category);
        apiPayload.append('subCategory', formData.subCategory);
        apiPayload.append('type', String(formData.type || ''));
        apiPayload.append('unit', String(formData.unit || ''));
        apiPayload.append('minOrderQty', Number(formData.minOrderQty) || 1);
        apiPayload.append('tax', Number(formData.tax) || 0);
        apiPayload.append('taxType', String(formData.taxType || ''));
        apiPayload.append('shippingCost', Number(formData.shippingCost) || 0);
        apiPayload.append('weight', Number(formData.weight) || 0);
        // Handle dimensions as nested object
        const dimensions = {
          length: Number(formData.length) || 0,
          width: Number(formData.width) || 0,
          height: Number(formData.height) || 0
        };
        apiPayload.append('dimensions', JSON.stringify(dimensions));
        apiPayload.append('status', String(formData.status || ''));
        apiPayload.append('featured', Boolean(formData.featured));
        apiPayload.append('metaTitle', String(formData.metaTitle || ''));
        apiPayload.append('metaDescription', String(formData.metaDescription || ''));
        apiPayload.append('pdf', String(formData.pdf || ''));
        apiPayload.append('createdBy', "651fa9f9eabf0f001fc6a826");
        
        // Handle images files - append each file with proper field name
        if (formData.images && formData.images.length > 0) {
          formData.images.forEach((file, index) => {
            apiPayload.append('images', file);
          });
        }
        
        // Handle tags as JSON array
        if (formData.tags && formData.tags.trim() !== '') {
          const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter(tag => tag !== '');
          apiPayload.append('tags', JSON.stringify(tagsArray));
        } else {
          apiPayload.append('tags', JSON.stringify([]));
        }
        
        // Handle attributes array
        if (formData.attributes && formData.attributes.length > 0) {
          apiPayload.append('attributes', JSON.stringify(formData.attributes));
        }
        
        // Handle variants array - explicitly set to empty array to avoid MongoDB issues
        if (formData.variants && formData.variants.length > 0) {
          // Filter out variants with null or empty SKUs to avoid duplicate key errors
          const validVariants = formData.variants.filter(variant => 
            variant.sku && variant.sku.trim() !== ''
          );
          if (validVariants.length > 0) {
            apiPayload.append('variants', JSON.stringify(validVariants));
          } else {
            // Explicitly set empty array to avoid MongoDB creating default variants
            apiPayload.append('variants', JSON.stringify([]));
          }
        } else {
          // Explicitly set empty array to avoid MongoDB creating default variants
          apiPayload.append('variants', JSON.stringify([]));
        }
      } else {
        // Use regular JSON payload
        apiPayload = {
        title: formData.title || '',
        slug:
          formData.slug ||
          formData.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''), // Auto-generate slug
        description: String(formData.description || ''),
        shortDescription: String(formData.shortDescription || ''),
        // Handle SKU - only include if not empty to avoid duplicate null values
        ...(formData.sku && formData.sku.trim() !== '' ? { sku: String(formData.sku) } : {}),
        // Handle barcode - only include if not empty to avoid duplicate empty strings
        ...(formData.barcode && formData.barcode.trim() !== '' ? { barcode: String(formData.barcode) } : {}),
        thumbnail: formData.thumbnail && formData.thumbnail.trim() !== '' ? String(formData.thumbnail) : '/uploads/default-thumbnail.jpg',
        images: [], // No images in JSON payload when no files uploaded
        brand: formData.brand,
        category: formData.category,
        subCategory: formData.subCategory,
        attributes: formData.attributes || [], // Product level attributes
        type: String(formData.type || ''),
        unit: String(formData.unit || ''),
        minOrderQty: Number(formData.minOrderQty) || 1,
        tax: Number(formData.tax) || 0,
        taxType: String(formData.taxType || ''),
        shippingCost: Number(formData.shippingCost) || 0,
        weight: Number(formData.weight) || 0,
        dimensions: {
          length: Number(formData.length) || 0,
          width: Number(formData.width) || 0,
          height: Number(formData.height) || 0,
        },
        status: String(formData.status || ''),
        featured: Boolean(formData.featured),
        metaTitle: String(formData.metaTitle || ''),
        metaDescription: String(formData.metaDescription || ''),
        pdf: String(formData.pdf || ''),
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(tag => tag !== '')
          : [],
        // Handle variants - explicitly set to empty array to avoid MongoDB issues
        variants: (() => {
          if (formData.variants && formData.variants.length > 0) {
            // Filter out variants with null or empty SKUs to avoid duplicate key errors
            const validVariants = formData.variants.filter(variant => 
              variant.sku && variant.sku.trim() !== ''
            );
            return validVariants;
          }
          return []; // Explicitly set empty array
        })(),
        createdBy: "651fa9f9eabf0f001fc6a826" // This should come from auth context
        };
      }

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
        const errorMessage = response?.data?.message || response?.data?.error || 'Failed to save product';
        toast.error(`Failed to save product: ${errorMessage}`);
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
        toast.error('Please fill the required fields');
      } else {
        // More detailed error handling
        let errorMessage = 'Failed to add product';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(`Error: ${errorMessage}`);
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
      ) : loadingCategories || loadingBrands ? (
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
              options={(() => {
                const options = [
                  { value: '', label: 'Select Brand' },
                  ...brands.map((brand) => ({
                    value: brand._id,
                    label: brand.displayName,
                  })),
                ];
                return options;
              })()}
              error={errors?.brand}
              disabled={loadingBrands}
            />
            <SelectField
              label="Category"
              name="category"
              value={formData.category}
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
              error={errors?.category}
              disabled={loadingCategories}
            />
            <SelectField
              label="Sub Category"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              options={(() => {
                const options = [
                  { value: '', label: 'Select Sub Category' },
                  ...subCategories.map((cat) => ({
                    value: cat._id,
                    label: cat.displayName,
                  })),
                ];
                return options;
              })()}
              error={errors?.subCategory}
              disabled={loadingSubCategories}
            />
            <FileUploadButton
              label="Thumbnail Image"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              onFileSelect={handleThumbnailSelect}
              showPreview={true}
              previewValue={formData.thumbnail}
              error={errors?.thumbnail}
            />

            {/* Images file upload for multiple images */}
            <div className="flex flex-col">
              <label htmlFor="images" className="mb-1 font-semibold text-gray-700">
                Product Images (Multiple Selection)
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className={`block w-full border rounded p-2 cursor-pointer text-gray-700 ${
                  errors?.images ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors?.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
              
              {/* Custom preview for multiple images - right below the Product Images field */}
              {formData.imagesPreview && formData.imagesPreview.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Selected Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.imagesPreview.map((previewUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={previewUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Remove this image from the preview and files
                            const newFiles = formData.images.filter((_, i) => i !== index);
                            const newPreviews = formData.imagesPreview.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              images: newFiles,
                              imagesPreview: newPreviews
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
