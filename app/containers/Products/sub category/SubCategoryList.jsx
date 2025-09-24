import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import DataNotFound from '@/components/custom-pages/DataNotFound';
import { SearchBarContainer } from '@/components/custom-search';
import TableContainer from '@/components/custom-pages/TableContainer';
import { useNavigate } from 'react-router-dom';

const SubCategoryList = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  // Pagination and search state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 5,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: '',
    isLoading: false,
  });

  // Fetch all categories to get parent names
  const fetchAllCategories = async () => {
    try {
      const response = await categoryService.getAll({ level: 0, limit: 1000 }); // Get only main categories
      if (response?.data?.success) {
        setAllCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching all categories:', err);
    }
  };

  // Fetch subcategories from API with pagination and search
  const fetchSubCategories = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          level: 1, // Only sub categories (level 1)
          ...(search && { search: search }),
        };

        console.log('API Request Params:', params); // Debug log
        const response = await categoryService.getAll(params);
        if (response?.data?.success) {
          // Use data directly from API (backend should return only level 1 categories)
          setSubCategories(response.data.data);

          // Update pagination state from API response (backend handles pagination)
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.page || page,
            totalPages:
              response.data.totalPages ||
              Math.ceil(response.data.total / pagination.itemsPerPage),
            totalItems: response.data.total || response.data.data.length,
          }));
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
    },
    [pagination.itemsPerPage],
  );

  // Load subcategories and all categories on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchAllCategories();
    fetchSubCategories(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchSubCategories, pagination.currentPage, searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchSubCategories(page, searchTerm);
  };

  // Handle search - throttled API call
  const handleSearch = (term) => {
    console.log('Search term:', term); // Debug log
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for throttled search (700ms delay)
    searchTimeoutRef.current = setTimeout(() => {
      fetchSubCategories(1, term);
    }, 700);
  };

  // Initial load effect - only for refreshTrigger
  useEffect(() => {
    fetchSubCategories(pagination.currentPage, searchTerm);
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get parent category name by ID
  const getParentCategoryName = (parentId) => {
    if (!parentId) return 'Root Category';

    // If parentId is an object (from API response), use its name directly
    if (typeof parentId === 'object' && parentId.name) {
      return parentId.name;
    }

    // If parentId is a string, find in allCategories
    const parentCategory = allCategories.find((cat) => cat._id === parentId);
    return parentCategory ? `${parentCategory.name}` : '-';
  };

  // Handle delete subcategory
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
        toast.success('Sub Category deleted successfully!');

        // Remove item from frontend state immediately
        setSubCategories((prev) =>
          prev.filter((subCategory) => subCategory._id !== deleteModal.itemId),
        );

        // Update pagination if needed
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          totalPages: Math.ceil((prev.totalItems - 1) / prev.itemsPerPage),
        }));
      } else {
        toast.error(response?.data?.message || 'Failed to delete sub category');
      }
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      toast.error(
        err?.response?.data?.message || 'Failed to delete sub category',
      );
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

  // Handle edit subcategory - navigate to form page with subcategory ID
  const handleEdit = (subCategory) => {
    console.log(subCategory, 'subcategory');
    // Only allow editing of sub categories (level 1)
    if (subCategory.level !== 1) {
      toast.error('Only sub categories can be edited from this page');
      return;
    }

    const finalId = subCategory.id || subCategory._id;
    navigate(`/products/subcategories/edit/${finalId}`);
  };

  // Handle view subcategory details
  const handleView = (subCategory) => {
    const finalId = subCategory.id || subCategory._id;
    navigate(`/products/subcategories/view/${finalId}`);
  };

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
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search subcategories..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading subcategories...</span>
        </div>
      )}

      {loading === false && subCategories.length === 0 && <DataNotFound />}

      {loading === false && subCategories.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Sub Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Category ID</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {subCategories.map((subCategory, index) => (
                <TableRow key={subCategory._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {subCategory.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {subCategory.description}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {getParentCategoryName(subCategory.parentId)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Level {subCategory.level || 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subCategory.isFeatured
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {subCategory.isFeatured ? 'Yes' : 'No'}
                    </span>
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
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
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
                        variant="outline"
                        onClick={() => handleEdit(subCategory)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
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
        title="Delete Sub Category"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </TableContainer>
  );
};

SubCategoryList.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default SubCategoryList;
