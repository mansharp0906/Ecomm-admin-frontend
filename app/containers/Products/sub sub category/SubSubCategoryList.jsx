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

const SubSubCategoryList = ({ refreshTrigger }) => {
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState([]);
  
  // Pagination and search state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 5
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

  // Fetch all sub categories to get parent names
  const fetchAllSubCategories = async () => {
    try {
      const response = await categoryService.getAll({ level: 1, limit: 1000 }); // Get all sub categories
      if (response?.data?.success) {
        setAllSubCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching all sub categories:', err);
    }
  };

  // Fetch sub sub categories from API with pagination and search
  const fetchSubSubCategories = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          level: 2, // Only sub sub categories (level 2)
          ...(search && { search: search }),
        };

        console.log('API Request Params:', params); // Debug log
        const response = await categoryService.getAll(params);
        if (response?.data?.success) {
          // Use data directly from API (backend should return only level 2 categories)
          setSubSubCategories(response.data.data);

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
          setError('Failed to fetch sub sub categories');
        }
      } catch (err) {
        console.error('Error fetching sub sub categories:', err);
        setError('Failed to fetch sub sub categories');
        toast.error('Failed to load sub sub categories');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage],
  );

  // Load sub sub categories and all sub categories on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchAllSubCategories();
    fetchSubSubCategories(pagination.currentPage, searchTerm);
  }, [refreshTrigger]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchSubSubCategories(page, searchTerm);
  };

  // Handle search - throttled API call
  const handleSearch = (term) => {
    console.log('Search term:', term); // Debug log
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for throttled search (700ms delay)
    searchTimeoutRef.current = setTimeout(() => {
      fetchSubSubCategories(1, term);
    }, 700);
  };

  // Get parent sub category name by ID
  const getParentSubCategoryName = (parentId) => {
    if (!parentId) return 'Root Category';
    
    // If parentId is an object (from API response), use its name directly
    if (typeof parentId === 'object' && parentId.name) {
      return parentId.name;
    }
    
    // If parentId is a string, find in allSubCategories
    const parentSubCategory = allSubCategories.find(
      (cat) => cat._id === parentId,
    );
    return parentSubCategory ? `${parentSubCategory.name}` : '-';
  };

  // Handle delete sub sub category
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

    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await categoryService.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Sub Sub Category deleted successfully!');
        
        // Remove item from frontend state immediately
        setSubSubCategories(prev => prev.filter(subSubCategory => subSubCategory._id !== deleteModal.itemId));
        
        // Update pagination if needed
        setPagination(prev => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          totalPages: Math.ceil((prev.totalItems - 1) / prev.itemsPerPage)
        }));
      } else {
        toast.error(response?.data?.message || 'Failed to delete sub sub category');
      }
    } catch (err) {
      console.error('Error deleting sub sub category:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete sub sub category');
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

  // Use data directly from API (backend handles filtering and pagination)
  const currentItems = subSubCategories;

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
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search sub sub categories..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading sub sub categories...</span>
        </div>
      )}

      {loading === false && currentItems.length === 0 && <DataNotFound />}

      {loading === false && currentItems.length > 0 && (
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
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
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
        title="Delete Sub Sub Category"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </TableContainer>
  );
};

SubSubCategoryList.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default SubSubCategoryList;
