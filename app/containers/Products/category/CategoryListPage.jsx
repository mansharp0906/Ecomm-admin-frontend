import {
  Button,
  Pagination,
  SearchBar,
  DeleteConfirmationModal,
  SearchBarContainer,
  LoadingData,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
  DataNotFound,
  CustomIcon,
  Container,
} from '@/components';
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import categoryService from '@/api/service/categoryService';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CategoryListPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Memoize filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  // Fetch categories from API with pagination and search
  const fetchCategories = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          level: 0, // Only main categories
          status: 'active', // Only active categories
          ...(search && { search: search }),
        };

        const response = await categoryService.getAll(params);
        if (response?.data?.success) {
          // Use data directly from API (backend should return only level 0 categories)
          setCategories(response.data.data);

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
          setError('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage],
  );

  // Load categories on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchCategories(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchCategories, pagination.currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchCategories(page, searchTerm);
  };

  // Handle search - throttled API call
  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for throttled search (300ms delay)
      searchTimeoutRef.current = setTimeout(() => {
        fetchCategories(1, term);
      }, 700);
    },
    [fetchCategories],
  );

  // Initial load effect - only for refreshTrigger
  useEffect(() => {
    fetchCategories(pagination.currentPage, searchTerm);
  }, [refreshTrigger]);

  // Handle delete category
  const handleDelete = useCallback((id, name) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemName: name,
      isLoading: false,
    });
  }, []);

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

        // Update pagination state
        setPagination((prev) => {
          const newTotalItems = prev.totalItems - 1;
          const newTotalPages = Math.ceil(newTotalItems / prev.itemsPerPage);
          
          // If current page is beyond the new total pages, go to last page
          let newCurrentPage = prev.currentPage;
          if (newTotalPages > 0 && prev.currentPage > newTotalPages) {
            newCurrentPage = newTotalPages;
          }

          return {
            ...prev,
            currentPage: newCurrentPage,
            totalItems: newTotalItems,
            totalPages: newTotalPages,
          };
        });

        // If current page becomes empty and there are previous pages, refetch data
        const remainingItems = categories.length - 1;
        if (remainingItems === 0 && pagination.currentPage > 1) {
          const newPage = pagination.currentPage - 1;
          setPagination((prev) => ({ ...prev, currentPage: newPage }));
          // Small delay to ensure state updates are complete before refetch
          setTimeout(() => {
            fetchCategories(newPage, searchTerm);
          }, 100);
        }

        // Fallback: If there are issues with state update, refetch after a short delay
        setTimeout(() => {
          // Check if the deleted item is still in the list (indicating state update failed)
          const deletedItemStillExists = categories.some(cat => cat._id === deleteModal.itemId);
          if (deletedItemStillExists) {
            console.log('State update failed, refetching data...');
            fetchCategories(pagination.currentPage, searchTerm);
          }
        }, 500);
      } else {
        toast.error(response?.data?.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Delete error:', err);
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

  // Handle edit category - navigate to form page with category ID
  const handleEdit = (category) => {
    // Only allow editing of main categories (level 0)
    if (category.level !== 0) {
      toast.error('Only main categories can be edited from this page');
      return;
    }
    const finalId = category.id || category._id;
    navigate(`/products/categories/edit/${finalId}`);
  };

  // Handle view category details
  const handleView = (category) => {
    const finalId = category.id || category._id;
    navigate(`/products/categories/view/${finalId}`);
  };

  return (
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>

      {loading && <LoadingData message="Loading data..." />}

      {loading === false && categories.length === 0 && <DataNotFound />}

      {loading === false && categories.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Image</TableHead>
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
                  <TableCell className="text-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 object-cover rounded-lg mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <CustomIcon type="image" size={6} />
                      </div>
                    )}
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
                    <div className="flex space-x-1 justify-center">
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
    </TableContainer>
  );
};

CategoryListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default React.memo(CategoryListPage);
