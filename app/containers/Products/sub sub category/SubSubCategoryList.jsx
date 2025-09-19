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

const SubSubCategoryList = ({ refreshTrigger }) => {
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all sub categories to get parent names
  const fetchAllSubCategories = async () => {
    try {
      const response = await categoryService.getTree();
      if (response?.data) {
        // Extract all sub categories (level 1) from the tree structure
        const allSubCats = [];

        const extractSubCategories = (categories) => {
          categories.forEach((category) => {
            if (category.children && category.children.length > 0) {
              // Check if children are Level 1 (sub categories)
              const level1Children = category.children.filter(
                (child) => child.level === 1,
              );
              if (level1Children.length > 0) {
                allSubCats.push(...level1Children);
              }
              // Recursively extract from deeper levels
              extractSubCategories(category.children);
            }
          });
        };

        extractSubCategories(response.data);
        setAllSubCategories(allSubCats);
      }
    } catch (err) {
      console.error('Error fetching all sub categories:', err);
    }
  };

  // Fetch sub sub categories from API using tree endpoint
  const fetchSubSubCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the tree endpoint to get hierarchical data
      const response = await categoryService.getTree();
      if (response?.data) {
        // Extract all sub sub categories (level 2) from the tree structure
        const allSubSubCategories = [];

        const extractSubSubCategories = (categories) => {
          categories.forEach((category) => {
            if (category.children && category.children.length > 0) {
              category.children.forEach((subCategory) => {
                if (subCategory.children && subCategory.children.length > 0) {
                  // Check if children are Level 2 (sub sub categories)
                  const level2Children = subCategory.children.filter(
                    (child) => child.level === 2,
                  );
                  if (level2Children.length > 0) {
                    allSubSubCategories.push(...level2Children);
                  }
                }
              });
            }
          });
        };

        extractSubSubCategories(response.data);
        setSubSubCategories(allSubSubCategories);
      } else {
        setError('Failed to fetch sub sub categories');
      }
    } catch (err) {
      console.error('Error fetching sub sub categories:', err);
      setError('Failed to fetch sub sub categories');
      toast.error('Failed to load sub sub categories');
    } finally {
      setLoading(false);
    }
  };

  // Load sub sub categories and all sub categories on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchAllSubCategories();
    fetchSubSubCategories();
  }, [refreshTrigger]);

  // Get parent sub category name by ID
  const getParentSubCategoryName = (parentId) => {
    if (!parentId) return 'Root Category';
    const parentSubCategory = allSubCategories.find(
      (cat) => cat._id === parentId,
    );
    return parentSubCategory ? `${parentSubCategory.name}` : '-';
  };

  // Handle delete sub sub category
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await categoryService.delete(id);
        if (response?.data?.success) {
          toast.success('Sub Sub Category deleted successfully!');
          fetchSubSubCategories(); // Refresh the list
        } else {
          toast.error('Failed to delete sub sub category');
        }
      } catch (err) {
        console.error('Error deleting sub sub category:', err);
        toast.error('Failed to delete sub sub category');
      }
    }
  };

  // Handle edit sub sub category (placeholder for now)
  const handleEdit = (subSubCategory) => {
    toast.info('Edit functionality will be implemented soon');
    console.log('Edit sub sub category:', subSubCategory);
  };

  // Handle view sub sub category details (placeholder for now)
  const handleView = (subSubCategory) => {
    toast.info('View functionality will be implemented soon');
    console.log('View sub sub category:', subSubCategory);
  };

  // Search and pagination calculations
  const filteredSubSubCategories = subSubCategories.filter((subSubCategory) => {
    const searchLower = searchTerm.toLowerCase();

    // Check if search term matches featured status
    const isFeaturedMatch =
      (searchLower === 'yes' && subSubCategory.isFeatured === true) ||
      (searchLower === 'no' && subSubCategory.isFeatured === false) ||
      (searchLower === 'featured' && subSubCategory.isFeatured === true) ||
      (searchLower === 'not featured' && subSubCategory.isFeatured === false);

    return (
      subSubCategory.name.toLowerCase().includes(searchLower) ||
      subSubCategory.description.toLowerCase().includes(searchLower) ||
      getParentSubCategoryName(subSubCategory.parentId)
        .toLowerCase()
        .includes(searchLower) ||
      subSubCategory.status.toLowerCase().includes(searchLower) ||
      isFeaturedMatch ||
      `level ${subSubCategory.level || 2}`.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredSubSubCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSubSubCategories.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading sub sub categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchSubSubCategories} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sub sub categories..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
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
            No sub sub categories found
          </h3>
          <p className="text-gray-600">
            Get started by creating your first sub sub category.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Sub Sub Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sub Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems.map((subSubCategory, index) => (
                <TableRow key={subSubCategory._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {subSubCategory.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {subSubCategory.description}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {getParentSubCategoryName(subSubCategory.parentId)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Level {subSubCategory.level || 2}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subSubCategory.isFeatured
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {subSubCategory.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subSubCategory.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {subSubCategory.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(subSubCategory)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(subSubCategory)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(subSubCategory._id, subSubCategory.name)
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
      {filteredSubSubCategories.length > itemsPerPage && (
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

SubSubCategoryList.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default SubSubCategoryList;
