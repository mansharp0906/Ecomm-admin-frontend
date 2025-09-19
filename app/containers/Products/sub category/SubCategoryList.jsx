import React, { useState, useEffect } from 'react';
import { Button } from '@/components/custom-button';
import categoryService from '@/api/service/categoryService';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/custom-table';
import CustomIcon from '@/components/custom-icon/CustomIcon';
import { Pagination } from '@/components';

const SubCategoryList = ({ refreshTrigger }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch all categories to get parent names
  const fetchAllCategories = async () => {
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        // Flatten all categories to create a lookup map
        const allCats = [];
        const flattenCategories = (cats) => {
          cats.forEach((cat) => {
            allCats.push(cat);
            if (cat.children && cat.children.length > 0) {
              flattenCategories(cat.children);
            }
          });
        };
        flattenCategories(response.data);
        setAllCategories(allCats);
      }
    } catch (err) {
      console.error('Error fetching all categories:', err);
    }
  };

  // Fetch subcategories from API using tree endpoint
  const fetchSubCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the tree endpoint to get hierarchical data
      const response = await categoryService.getTree();
      if (response?.data) {
        // Extract all subcategories (level > 0) from the tree structure
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
        setSubCategories(allSubCategories);
      } else {
        setError('Failed to fetch subcategories');
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError('Failed to fetch subcategories');
      toast.error('Failed to load subcategories');
    } finally {
      setLoading(false);
    }
  };

  // Load subcategories and all categories on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchAllCategories();
    fetchSubCategories();
  }, [refreshTrigger]);

  // Get parent category name by ID
  const getParentCategoryName = (parentId) => {
    if (!parentId) return 'Root Category';
    const parentCategory = allCategories.find((cat) => cat._id === parentId);
    return parentCategory ? `${parentCategory.name}` : '-';
  };

  // Handle delete subcategory
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await categoryService.delete(id);
        if (response?.data?.success) {
          toast.success('Sub Category deleted successfully!');
          fetchSubCategories(); // Refresh the list
        } else {
          toast.error('Failed to delete sub category');
        }
      } catch (err) {
        console.error('Error deleting subcategory:', err);
        toast.error('Failed to delete sub category');
      }
    }
  };

  // Handle edit subcategory (placeholder for now)
  const handleEdit = (subCategory) => {
    toast.info('Edit functionality will be implemented soon');
    console.log('Edit subcategory:', subCategory);
  };

  // Handle view subcategory details (placeholder for now)
  const handleView = (subCategory) => {
    toast.info('View functionality will be implemented soon');
    console.log('View subcategory:', subCategory);
  };

  // Pagination calculations
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = subCategories.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading subcategories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchSubCategories} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Sub Categories List
        </h3>
        <p className="text-sm text-gray-600">
          Manage your product sub categories
        </p>
      </div>

      {currentItems.length === 0 ? (
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
            No subcategories found
          </h3>
          <p className="text-gray-600">
            Get started by creating your first sub category.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sub Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems.map((subCategory) => (
                <TableRow key={subCategory._id}>
                  <TableCell className="font-medium text-gray-900">
                    {subCategory.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    {subCategory.description}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {getParentCategoryName(subCategory.parentId)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subCategory.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {subCategory.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(subCategory.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(subCategory)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(subCategory)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(subCategory._id, subCategory.name)
                        }
                        title="Delete"
                      >
                        <CustomIcon type="delete" size={4} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {subCategories.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            className="justify-center"
          />
        </div>
      )}
    </div>
  );
};

SubCategoryList.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default SubCategoryList;
