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
import { Pagination, SearchBar, DeleteConfirmationModal } from '@/components';
import DataNotFound from '@/components/custom-page-loading/DataNotFound';

const CategoryListPage = ({ refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination and search state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: '',
    isLoading: false,
  });

  // Fetch categories from API with pagination and search
  const fetchCategories = async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        level: 0, // Only main categories
        ...(search && { search }),
      };

      const response = await categoryService.getAll(params);
      if (response?.data?.success) {
        // Filter only level 0 categories (main categories)
        const level0Categories = response.data.data.filter(
          (category) => category.level === 0,
        );
        setCategories(level0Categories);

        // Update pagination state from API response
        setPagination((prev) => ({
          ...prev,
          currentPage: response.data.page || page,
          totalPages: Math.ceil(
            level0Categories.length / pagination.itemsPerPage,
          ),
          totalItems: level0Categories.length,
        }));
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
    fetchCategories(pagination.currentPage, searchTerm);
  }, [refreshTrigger]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchCategories(page, searchTerm);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchCategories(1, term);
  };

  // Handle delete category
  const handleDelete = (id, name) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemName: name,
      isLoading: false,
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteModal.itemId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await categoryService.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Category deleted successfully!');

        // Remove item from frontend state immediately
        setCategories((prev) =>
          prev.filter((category) => category._id !== deleteModal.itemId),
        );

        // Update pagination if needed
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          totalPages: Math.ceil((prev.totalItems - 1) / prev.itemsPerPage),
        }));
      } else {
        toast.error(response?.data?.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    } finally {
      // Always close modal after operation (success or error)
      setDeleteModal({
        isOpen: false,
        itemId: null,
        itemName: '',
        isLoading: false,
      });
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemName: '',
      isLoading: false,
    });
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-80">
            <SearchBar
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              size="md"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <DataNotFound />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {category.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Level {category.level || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isFeatured
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(category)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(category._id, category.name)
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
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            className="justify-center"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

CategoryListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default CategoryListPage;
