import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  InputTextField,
  SelectField,
  TextAreaField,
  ScrollContainer,
  FileUploadButton,
  LoadingData,
} from '@/components';
import { toast } from 'react-toastify';
import { useValidation } from '@/validations';
import { shopCreateSchema, shopUpdateSchema } from '@/validations';
import {
  buildShopPayload,
  handleFileUpload,
  handleInputChange as utilHandleInputChange,
} from '@/utils';
import shopService from '@/api/service/shopServices';
import { useNavigate } from 'react-router-dom';

const ShopForm = ({ onSuccess, onCancel, shopId, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
    socialMedia: {
      website: '',
      facebook: '',
      instagram: '',
    },
    settings: {
      commissionRate: 12,
      autoApproveProducts: false,
    },
    logo: null,
    banner: null,
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();

  const { validate, errors, setErrors, clearErrors, clearFieldError } =
    useValidation(isEditMode ? shopUpdateSchema : shopCreateSchema);

  // ✅ Fixed fetch logic with correct data structure
  const fetchShopData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await shopService.getById(shopId);

      if (typeof response?.data === 'string') {
        toast.error('Server error: API returned HTML instead of JSON');
        return;
      }

      // ✅ Correctly extract shop from payload
      const shop = response?.data?.data?.shop;
      if (!shop) {
        toast.error('No shop data found');
        return;
      }

      const newFormData = {
        name: shop.name || '',
        description: shop.description || '',
        contact: {
          email: shop.contact?.email || '',
          phone: shop.contact?.phone || '',
          address: {
            street: shop.contact?.address?.street || '',
            city: shop.contact?.address?.city || '',
            state: shop.contact?.address?.state || '',
            country: shop.contact?.address?.country || '',
            zipCode: shop.contact?.address?.zipCode || '',
          },
        },
        socialMedia: {
          website: shop.socialMedia?.website || '',
          facebook: shop.socialMedia?.facebook || '',
          instagram: shop.socialMedia?.instagram || '',
        },
        settings: {
          commissionRate: shop.settings?.commissionRate ?? 12,
          autoApproveProducts: shop.settings?.autoApproveProducts ?? false,
        },
        logo: shop.logo || null,
        banner: shop.banner || null,
      };

      console.log('✅ Prefilled Shop Data:', newFormData);
      setFormData(newFormData);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      if (error.message?.includes('Unexpected token')) {
        toast.error('Server returned invalid response format');
      } else {
        toast.error('Failed to fetch shop data: ' + error.message);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [shopId]);

  // ✅ Trigger fetch when editing
  useEffect(() => {
    if (isEditMode && shopId) {
      fetchShopData();
    }
  }, [isEditMode, shopId, fetchShopData]);

  // -------------------------
  // ✅ Input & File Handlers
  // -------------------------
  const handleInputChange = (e) => {
    utilHandleInputChange(e, setFormData, clearFieldError);
  };

  const handleLogoSelect = (file) => {
    handleFileUpload(file, setFormData, 'logo', {
      clearErrors: clearFieldError,
    });
  };

  const handleBannerSelect = (file) => {
    handleFileUpload(file, setFormData, 'banner', {
      clearErrors: clearFieldError,
    });
  };

  // -------------------------
  // ✅ Submit Handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      const validationData = {
        ...formData,
        id: isEditMode ? shopId : undefined,
      };

      const isValid = await validate(validationData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      const { id, ...payloadData } = formData;
      const apiPayload = buildShopPayload(payloadData);

      let response;
      if (isEditMode) {
        response = await shopService.update(shopId, apiPayload);
      } else {
        response = await shopService.create(apiPayload);
      }

      const isSuccess =
        response?.data?.success ||
        (response?.status >= 200 && response?.status < 300);

      if (isSuccess) {
        toast.success(`Shop ${isEditMode ? 'updated' : 'added'} successfully!`);
        setFormData({
          name: '',
          description: '',
          contact: {
            email: '',
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
            },
          },
          socialMedia: { website: '', facebook: '', instagram: '' },
          settings: { commissionRate: 12, autoApproveProducts: false },
          logo: null,
          banner: null,
        });
        setErrors({});
        onSuccess && onSuccess(response.data.data || response.data);
      } else {
        toast.error('Failed to save Shop');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        Object.keys(validationErrors).forEach((key) => {
          setErrors((prev) => ({ ...prev, [key]: validationErrors[key] }));
        });
      } else if (
        error.response?.status === 500 &&
        error.response?.data?.error?.includes('duplicate key')
      ) {
        toast.error(
          'A shop with this name already exists. Please choose a different name.',
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} shop`;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // ✅ Cancel Handler
  // -------------------------
  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      contact: {
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      },
      socialMedia: { website: '', facebook: '', instagram: '' },
      settings: { commissionRate: 12, autoApproveProducts: false },
      logo: null,
      banner: null,
    });
    setErrors({});
    if (onCancel) onCancel();
    navigate('/shops');
  };

  // -------------------------
  // ✅ JSX
  // -------------------------
  return (
    <div className="bg-white rounded-lg shadow flex flex-col">
      {isEditMode && isLoadingData ? (
        <LoadingData message="Loading data..." size="50px" />
      ) : (
        <ScrollContainer>
          <form
            onSubmit={handleSubmit}
            className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
            id="shop-form"
          >
            <InputTextField
              label="Shop Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors?.name}
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors?.description}
              className="sm:col-span-2"
              rows={3}
            />
            <InputTextField
              label="Contact Email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleInputChange}
              error={errors?.['contact.email']}
            />
            <InputTextField
              label="Contact Phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleInputChange}
              error={errors?.['contact.phone']}
            />
            <InputTextField
              label="Street Address"
              name="contact.address.street"
              value={formData.contact.address.street}
              onChange={handleInputChange}
              error={errors?.['contact.address.street']}
            />
            <InputTextField
              label="City"
              name="contact.address.city"
              value={formData.contact.address.city}
              onChange={handleInputChange}
              error={errors?.['contact.address.city']}
            />
            <InputTextField
              label="State"
              name="contact.address.state"
              value={formData.contact.address.state}
              onChange={handleInputChange}
              error={errors?.['contact.address.state']}
            />
            <InputTextField
              label="Country"
              name="contact.address.country"
              value={formData.contact.address.country}
              onChange={handleInputChange}
              error={errors?.['contact.address.country']}
            />
            <InputTextField
              label="Zip Code"
              name="contact.address.zipCode"
              value={formData.contact.address.zipCode}
              onChange={handleInputChange}
              error={errors?.['contact.address.zipCode']}
            />
            <InputTextField
              label="Website"
              name="socialMedia.website"
              value={formData.socialMedia.website}
              onChange={handleInputChange}
              error={errors?.['socialMedia.website']}
            />
            <InputTextField
              label="Facebook"
              name="socialMedia.facebook"
              value={formData.socialMedia.facebook}
              onChange={handleInputChange}
              error={errors?.['socialMedia.facebook']}
            />
            <InputTextField
              label="Instagram"
              name="socialMedia.instagram"
              value={formData.socialMedia.instagram}
              onChange={handleInputChange}
              error={errors?.['socialMedia.instagram']}
            />
            <InputTextField
              label="Commission Rate (%)"
              type="number"
              name="settings.commissionRate"
              value={formData.settings.commissionRate}
              onChange={handleInputChange}
              error={errors?.['settings.commissionRate']}
            />
            <SelectField
              label="Auto Approve Products"
              name="settings.autoApproveProducts"
              value={formData.settings.autoApproveProducts}
              onChange={handleInputChange}
              options={[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]}
              error={errors?.['settings.autoApproveProducts']}
            />
            <FileUploadButton
              id="shop-logo"
              label="Logo Upload"
              accept="image/*"
              showPreview
              previewValue={formData.logo}
              onFileSelect={handleLogoSelect}
              error={errors?.logo}
            />
            <FileUploadButton
              id="shop-banner"
              label="Banner Upload"
              accept="image/*"
              showPreview
              previewValue={formData.banner}
              onFileSelect={handleBannerSelect}
              error={errors?.banner}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-end space-x-4">
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
                form="shop-form"
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
          </form>
        </ScrollContainer>
      )}
    </div>
  );
};

ShopForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  shopId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export default ShopForm;
