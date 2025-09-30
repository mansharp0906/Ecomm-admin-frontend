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
import categoryService from '@/api/service/categoryService';
import { toast } from 'react-toastify';

const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getById(id);

      if (response?.data?.success) {
        setCategory(response.data.data);
      } else if (response?.data) {
        setCategory(response.data);
      } else {
        setError('Failed to fetch category data');
      }
    } catch (err) {
      setError('Failed to load category details');
      toast.error('Failed to load category details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/products/categories/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/products/categories');
  };

  if (loading) {
    return (
      <Container>
        <LoadingData message="Loading data..." />
      </Container>
    );
  }

  if (error || !category) {
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <CustomIcon type="error" size={8} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Category
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Category not found'}</p>
          <div className="space-x-4">
            <Button onClick={fetchCategoryData} variant="primary">
              Retry
            </Button>
            <Button onClick={handleBack} variant="secondary">
              Back to Categories
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeaderWithActions
        title="Category Details"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Categories', href: '/products/categories' },
          { label: category.name },
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
            <h2 className="text-xl font-semibold text-gray-900">
              {category.name}
            </h2>
            <p className="text-sm text-gray-500">Category ID: {category._id}</p>
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
                <p className="mt-1 text-sm text-gray-900">{category.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {category.slug || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {category.description || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Level {category.level || 0}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {category.priority || 'N/A'}
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
                    category.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {category.status || 'N/A'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Featured
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.isFeatured
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {category.image ? (
                  <div className="mt-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Click to view full size
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 h-32 w-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <CustomIcon type="image" size={8} />
                      <p className="text-xs text-gray-500 mt-1">No image</p>
                    </div>
                  </div>
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
                  {category.metaTitle || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {category.metaDescription || 'N/A'}
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
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleString('en-US', {
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
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleString('en-US', {
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
      </ScrollContainer>
    </Container>
  );
};

export default CategoryView;
