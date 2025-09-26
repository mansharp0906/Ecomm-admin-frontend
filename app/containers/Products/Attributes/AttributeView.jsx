import {
  Button,
  LoadingData,
  Container,
  Breadcrumb,
  CustomIcon,
} from '@/components';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import attributeService from '@/api/service/attributeService';
import { toast } from 'react-toastify';

const AttributeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchAttributeData();
    }
  }, [id]);

  const fetchAttributeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await attributeService.getById(id);

      if (response?.data?.success) {
        setAttributes(response.data.data);
      } else if (response?.data) {
        setAttributes(response.data);
      } else {
        setError('Failed to fetch Attribute data');
      }
    } catch (err) {
      setError('Failed to load Attribute details');
      toast.error('Failed to load Attribute details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/products/attributes/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/products/attributes');
  };

  if (loading) {
    return (
      <Container>
        <LoadingData message="Loading data..." />
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attribute Details
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="edit" size={4} />
              <span>Edit Attribute</span>
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
            { label: 'Attributes', href: '/products/attributes' },
            { label: attributes?.name },
          ]}
        />
      </div>

      <div
        className="bg-white rounded-lg shadow overflow-hidden"
        style={{ minHeight: '600px', overflowY: 'auto', height: '600px' }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {attributes?.name}
              </h2>
              <p className="text-sm text-gray-500">
                Attribute ID: {attributes?._id}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                {attributes?.displayType || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attribute Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{attributes?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {attributes?.slug || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Level {attributes?.level || 0}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Type
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  {attributes?.displayType || 'N/A'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Filterable
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    attributes?.isFilterable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {attributes?.isFilterable ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    attributes?.isRequired
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {attributes?.isRequired ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Status & Media Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Status & Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    attributes?.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {attributes?.status || 'N/A'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Featured
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    attributes?.isFeatured
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {attributes?.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {attributes?.image ? (
                  <div className="mt-2">
                    <img
                      src={attributes.image}
                      alt={attributes.name}
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

          {/* Categories */}
          {attributes?.categories && attributes?.categories?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Associated Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {attributes?.categories.map((category, index) => (
                  <span
                    key={category?._id || index}
                    className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800"
                  >
                    {category?.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attribute Values */}
          {attributes?.values && attributes?.values?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Attribute Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attributes.values.map((value, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {value.value}
                      </span>
                      {value.isDefault && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                    {value.color && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: value.color }}
                        />
                        <span className="text-xs text-gray-600">
                          {value.color}
                        </span>
                      </div>
                    )}
                    {value.image && (
                      <div className="mt-2">
                        <img
                          src={value.image}
                          alt={value.value}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  {attributes?.createdAt
                    ? new Date(attributes?.createdAt).toLocaleString('en-US', {
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
                  {attributes?.updatedAt
                    ? new Date(attributes?.updatedAt).toLocaleString('en-US', {
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

export default AttributeView;
