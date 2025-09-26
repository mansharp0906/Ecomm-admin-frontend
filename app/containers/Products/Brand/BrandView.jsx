import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom-button';
import Container from '@/components/custom-pages/Container';
import Breadcrumb from '@/components/custom-pages/Breadcrumb';
import brandService from '@/api/service/brandService';
import { toast } from 'react-toastify';
import CustomIcon from '@/components/custom-icon/CustomIcon';
import { LoadingData } from '@/components/custom-pages';

const BrandView = () => {
  const { id } = useParams();
 const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBandData();
    }
  }, [id]);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await brandService.getById(id);

      if (response?.data?.success) {
        setBrands(response.data.data);
      } else if (response?.data) {
        setBrands(response.data);
      } else {
        setBrands('Failed to fetch Brand data');
      }
    } catch (err) {
     
      setError('Failed to load category details');
      toast.error('Failed to load category details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/products/bands/edit/${id}`);
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

  if (error || !brands) {
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <CustomIcon type="error" size={8} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Brands
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Brands not found'}</p>
          <div className="space-x-4">
            <Button onClick={fetchBrandData} variant="primary">
              Retry
            </Button>
            <Button onClick={handleBack} variant="secondary">
              Back to Brand
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
            <h1 className="text-3xl font-bold text-gray-900">
              Brands Details
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="edit" size={4} />
              <span>Edit Brands</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="arrow-left" size={4} />
              <span>Back to Brands</span>
            </Button>
          </div>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Brands', href: '/products/brands' },
            { label: brands.name },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {brands.name}
          </h2>
          <p className="text-sm text-gray-500">Brands ID: {brands._id}</p>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{brands.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {brands.slug || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {brands.description || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Level {brands.level || 0}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {brands.priority || 'N/A'}
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
                    brands.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {brands.status || 'N/A'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Featured
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    brands.isFeatured
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {brands.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {brands.image ? (
                  <div className="mt-2">
                    <img
                      src={brands.image}
                      alt={brands.name}
                      className="h-20 w-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No image</p>
                )}
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              SEO Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {brands.metaTitle || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {brands.metaDescription || 'N/A'}
                </p>
              </div>
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
                  {brands.createdAt
                    ? new Date(brands.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {brands.updatedAt
                    ? new Date(brands.updatedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BrandView;