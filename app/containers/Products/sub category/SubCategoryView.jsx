import { Button, LoadingData, Container, Breadcrumb, CustomIcon } from '@/components';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import categoryService from '@/api/service/categoryService';
import { toast } from 'react-toastify';


const SubCategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSubCategoryData();
    }
  }, [id]);

  const fetchSubCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getById(id);

      let categoryData;
      if (response?.data?.success) {
        categoryData = response.data.data;
      } else if (response?.data) {
        categoryData = response.data;
      } else {
        setError('Failed to fetch sub-category data');
        return;
      }

      setSubCategory(categoryData);

      // Fetch parent category if parentId exists
      if (categoryData.parentId) {
        try {
          let parentId = categoryData.parentId;
          if (typeof parentId === 'object' && parentId._id) {
            parentId = parentId._id;
          }

          const parentResponse = await categoryService.getById(parentId);
          if (parentResponse?.data?.success) {
            setParentCategory(parentResponse.data.data);
          } else if (parentResponse?.data) {
            setParentCategory(parentResponse.data);
          }
        } catch (parentErr) {
          console.warn('Could not fetch parent category:', parentErr);
        }
      }
    } catch (err) {
    
      setError('Failed to load sub-category details');
      toast.error('Failed to load sub-category details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/products/subcategories/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/products/subcategories');
  };

  const handleViewParent = () => {
    if (parentCategory) {
      navigate(`/products/categories/view/${parentCategory._id}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingData message="Loading subcatgeories details" />
      </Container>
    );
  }

  if (error || !subCategory) {
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <CustomIcon type="error" size={8} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Sub-Category
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Sub-category not found'}
          </p>
          <div className="space-x-4">
            <Button onClick={fetchSubCategoryData} variant="primary">
              Retry
            </Button>
            <Button onClick={handleBack} variant="secondary">
              Back to Sub-Categories
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
              Sub-Category Details
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="edit" size={4} />
              <span>Edit Sub-Category</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <CustomIcon type="arrow-left" size={4} />
              <span>Back to Sub-Categories</span>
            </Button>
          </div>
        </div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sub-Categories', href: '/products/subcategories' },
            { label: subCategory.name },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {subCategory.name}
          </h2>
          <p className="text-sm text-gray-500">
            Sub-Category ID: {subCategory._id}
          </p>
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
                <p className="mt-1 text-sm text-gray-900">{subCategory.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {subCategory.slug || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {subCategory.description || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Level {subCategory.level || 1}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {subCategory.priority || 'N/A'}
                </p>
              </div>
            </div>

            {/* Parent Category & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Parent Category & Status
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Parent Category
                </label>
                {parentCategory ? (
                  <div className="mt-1 flex items-center space-x-2">
                    <p className="text-sm text-gray-900">
                      {parentCategory.name}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleViewParent}
                      className="text-xs"
                    >
                      View Parent
                    </Button>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    No parent category
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subCategory.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {subCategory.status || 'N/A'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Featured
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subCategory.isFeatured
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {subCategory.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {subCategory.image ? (
                  <div className="mt-2">
                    <img
                      src={subCategory.image}
                      alt={subCategory.name}
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
                  {subCategory.metaTitle || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {subCategory.metaDescription || 'N/A'}
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
                  {subCategory.createdAt
                    ? new Date(subCategory.createdAt).toLocaleString('en-US', {
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
                  {subCategory.updatedAt
                    ? new Date(subCategory.updatedAt).toLocaleString('en-US', {
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

export default SubCategoryView;
