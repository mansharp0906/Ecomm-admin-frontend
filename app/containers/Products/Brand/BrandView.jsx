import {
  Button,
  LoadingData,
  Container,
  Breadcrumb,
  CustomIcon,
  ScrollContainer,
} from '@/components';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import brandService from '@/api/service/brandService';
import { toast } from 'react-toastify';

import { formatDateLong } from '@/utils';
const BrandView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBrandData();
    }
  }, [id]);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await brandService.getById(id);

      if (response?.data?.success) {
        setBrand(response.data.data);
      } else if (response?.data) {
        setBrand(response.data);
      } else {
        setError('Failed to fetch Brand data');
      }
    } catch (err) {
      console.error('Error fetching brand:', err);
      setError('Failed to load brand details');
      toast.error('Failed to load brand details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/products/brands/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/products/brands');
  };

  if (loading) {
    return (
      <Container>
        <LoadingData message="Loading data..." />
      </Container>
    );
  }

  if (error || !brand) {
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <CustomIcon type="error" size={8} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Brand
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Brand not found'}</p>
          <div className="space-x-4">
            <Button onClick={fetchBrandData} variant="primary">
              Retry
            </Button>
            <Button onClick={handleBack} variant="secondary">
              Back to Brands
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Details</h1>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="edit" size={4} />
              <span>Edit</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="arrow-left" size={4} />
              <span>Back</span>
            </Button>
          </div>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Brands', href: '/products/brands' },
            { label: brand?.name || 'Brand Details' },
          ]}
        />
      </div>

      <ScrollContainer>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Images */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Logo
                  </h3>
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-500">
                      No Logo
                    </div>
                  )}
                  {!brand.logo && (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-500 hidden">
                      No Logo
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Banner
                  </h3>
                  {brand.banner ? (
                    <img
                      src={brand.banner}
                      alt={`${brand.name} banner`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-500">
                      No Banner
                    </div>
                  )}
                  {!brand.banner && (
                    <div className="w-full h-32 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-500 hidden">
                      No Banner
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="text-lg text-gray-900">{brand.name}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Slug
                      </label>
                      <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {brand.slug}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          brand.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {brand.status}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Priority
                      </label>
                      <p className="text-sm text-gray-900">{brand.priority}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700">
                    {brand.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    SEO Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Meta Title
                      </label>
                      <p className="text-sm text-gray-900">
                        {brand.metaTitle || 'Not set'}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Meta Description
                      </label>
                      <p className="text-sm text-gray-700">
                        {brand.metaDescription || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Timestamps
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {formatDateLong(brand.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{' '}
                      {formatDateLong(brand.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </Container>
  );
};

export default BrandView;
