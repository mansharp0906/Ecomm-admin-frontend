import React, { useState, useEffect } from 'react';
import { Button } from '@/components/custom-button';
import categoryService from '@/api/service/categoryService';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import PropTypes from 'prop-types';

const CategoryListPage = ({ refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        // Extract all categories (flatten the tree structure)
        const allCategories = [];
        const flattenCategories = (cats) => {
          cats.forEach((category) => {
            allCategories.push(category);
            if (category.children && category.children.length > 0) {
              flattenCategories(category.children);
            }
          });
        };
        flattenCategories(response.data);

        // Filter only main categories (level 0) for display
        const mainCategories = allCategories.filter((cat) => cat.level === 0);
        setCategories(mainCategories);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  // Handle delete category
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await categoryService.delete(id);
        if (response?.data?.success) {
          toast.success('Category deleted successfully!');
          fetchCategories(); // Refresh the list
        } else {
          toast.error('Failed to delete category');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        toast.error('Failed to delete category');
      }
    }
  };

  // Handle edit category (placeholder for now)
  const handleEdit = (category) => {
    toast.info('Edit functionality will be implemented soon');
    console.log('Edit category:', category);
  };

  // Handle view category details (placeholder for now)
  const handleView = (category) => {
    toast.info('View functionality will be implemented soon');
    console.log('View category:', category);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchCategories} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Categories List</h3>
        <p className="text-sm text-gray-600">Manage your product categories</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600">
            Get started by creating your first category.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 max-w-xs">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 max-w-xs">
                      {category.metaTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {category.metaDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      // hour: '2-digit',
                      // minute: '2-digit',
                    })}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(category)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <MdVisibility className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <MdEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category._id, category.name)
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

CategoryListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default CategoryListPage;
