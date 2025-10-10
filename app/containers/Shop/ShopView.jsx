import {
  Button,
  LoadingData,
  Container,
  CustomIcon,
  PageHeaderWithActions,
  ScrollContainer,
} from '@/components';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import shopService from '@/api/service/shopServices';
import { toast } from 'react-toastify';

const ShopView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchShopData();
  }, [id]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getById(id);

      if (response?.data?.success) {
        setShop(response.data.data.shop); // ✅ Correctly get shop
      } else if (response?.data?.shop) {
        setShop(response.data.shop);
      } else {
        setError('Failed to fetch shop data');
      }
    } catch (err) {
      setError('Failed to load shop details');
      toast.error('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => navigate(`/shop/edit/${id}`);
  const handleBack = () => navigate('/shops');

  if (loading) {
    return (
      <Container>
        <LoadingData message="Loading data..." />
      </Container>
    );
  }

  if (error || !shop) {
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <CustomIcon type="error" size={8} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Shop
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Shop not found'}</p>
          <div className="space-x-4">
            <Button onClick={fetchShopData} variant="primary">
              Retry
            </Button>
            <Button onClick={handleBack} variant="secondary">
              Back to Shop
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeaderWithActions
        title="Shop Details"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Shop', href: '/shops' },
          { label: shop.name || 'Shop' },
        ]}
        actions={[
          {
            label: 'Edit',
            onClick: handleEdit,
            variant: 'outline',
            icon: <CustomIcon type="edit" size={4} />,
          },
          {
            label: 'Back',
            onClick: handleBack,
            variant: 'secondary',
            icon: <CustomIcon type="arrow-left" size={4} />,
          },
        ]}
      />

      <ScrollContainer>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{shop.name}</h2>
            <p className="text-sm text-gray-500">
              Shop ID: {shop._id.$oid || shop._id}
            </p>
          </div>

          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{shop.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.slug || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.description || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.contact?.email || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.contact?.phone || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.contact?.address?.street}, {shop.contact?.address?.city}
                  , {shop.contact?.address?.state},{' '}
                  {shop.contact?.address?.country} -{' '}
                  {shop.contact?.address?.zipCode}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Social Media
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  Website: {shop.socialMedia?.website || 'N/A'}
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  Facebook: {shop.socialMedia?.facebook || 'N/A'}
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  Instagram: {shop.socialMedia?.instagram || 'N/A'}
                </p>
              </div>
            </div>

            {/* Status & Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Status & Media
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    shop.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {shop.status || 'N/A'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Active
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    shop.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {shop.isActive ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt="Logo"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <CustomIcon type="image" size={8} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banner
                </label>
                {shop.banner ? (
                  <img
                    src={shop.banner}
                    alt="Banner"
                    className="h-32 w-full object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="h-32 w-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <CustomIcon type="image" size={8} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p>Total Products: {shop.stats?.totalProducts || 0}</p>
              <p>Active Products: {shop.stats?.activeProducts || 0}</p>
              <p>Total Sales: {shop.stats?.totalSales || 0}</p>
              <p>Total Earnings: {shop.stats?.totalEarnings || 0}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.createdAt?.$date
                    ? new Date(shop.createdAt.$date).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {shop.updatedAt?.$date
                    ? new Date(shop.updatedAt.$date).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </Container>
  );
};

export default ShopView;
