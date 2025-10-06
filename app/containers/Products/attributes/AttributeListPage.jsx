import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Button, 
  Container, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableContainer, 
  DataNotFound, 
  LoadingData, 
  CustomIcon, 
  Pagination, 
  SearchBar, 
  SearchBarContainer, 
  DeleteConfirmationModal 
} from '@/components';
import attributeService from '@/api/service/attributeService';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

import { formatDateShort } from '@/utils';
const AttributeListPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get('categoryId');
  const [attributes, setAttributes] = useState([]);
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

  // Memoize filtered attributes
  const filteredAttributes = useMemo(() => {
    if (!searchTerm) return attributes;
    return attributes.filter(attr => 
      attr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attributes, searchTerm]);

  // Fetch attributes from API with pagination and search
  const fetchAttributes = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...(search && { search }),
        };

        const response = categoryId
          ? await attributeService.getByCategory(categoryId, params)
          : await attributeService.getAll(params);
        const payload = response?.data;
        let items = [];
        let totalItems = 0;
        let totalPages = 0;
        let currentPage = page;

        if (payload?.success) {
          items = payload.data || [];
          totalItems = payload.total || (Array.isArray(payload.data) ? payload.data.length : 0);
          totalPages = payload.totalPages || Math.ceil(totalItems / pagination.itemsPerPage);
          currentPage = payload.page || page;
        } else if (Array.isArray(payload)) {
          items = payload;
          totalItems = payload.length;
          totalPages = Math.max(1, Math.ceil(totalItems / pagination.itemsPerPage));
        } else if (payload?.data && Array.isArray(payload.data)) {
          items = payload.data;
          totalItems = payload.total || payload.data.length;
          totalPages = payload.totalPages || Math.ceil(totalItems / pagination.itemsPerPage);
          currentPage = payload.page || page;
        }

        if (!Array.isArray(items)) {
          setError('Failed to fetch attributes');
        } else {
          setAttributes(items);
          setPagination((prev) => ({
            ...prev,
            currentPage,
            totalPages,
            totalItems,
          }));
        }
      } catch (err) {
        console.error('Error fetching attributes:', err);
        setError('Failed to fetch attributes');
        toast.error('Failed to load attributes');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage],
  );

  // Load attributes on mount and when dependencies change
  useEffect(() => {
    fetchAttributes(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchAttributes, pagination.currentPage, categoryId]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handle search - debounced API call
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchAttributes(1, term);
    }, 700);
  }, [fetchAttributes]);

  // Handle delete attribute
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
      const response = await attributeService.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Attribute deleted successfully!');

        // Remove locally for snappy UI
        setAttributes((prev) =>
          prev.filter(
            (attribute) =>
              String(attribute?._id || attribute?.id) !==
              String(deleteModal.itemId),
          ),
        );

        // Recalculate pagination and refetch the correct page from server
        const newTotalItems = pagination.totalItems - 1;
        const newTotalPages = Math.max(
          1,
          Math.ceil(newTotalItems / pagination.itemsPerPage),
        );
        const nextPage =
          pagination.currentPage > newTotalPages
            ? newTotalPages
            : pagination.currentPage;

        setPagination((prev) => ({
          ...prev,
          totalItems: newTotalItems,
          totalPages: newTotalPages,
          currentPage: nextPage,
        }));

        // Ensure UI matches server (handles empty-page edge case)
        await fetchAttributes(nextPage, searchTerm);
      } else {
        toast.error(response?.data?.message || 'Failed to delete attribute');
      }
    } catch (err) {
      // console.error('Error deleting attribute:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete attribute');
    } finally {
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

  // Edit handler
  const handleEdit = (attribute) => {
    // If your attributes have more levels, check here
    if (attribute.level !== undefined && attribute.level !== 0) {
      toast.error('Only main attributes can be edited from this page');
      return;
    }
    const finalId = attribute.id || attribute._id;
    navigate(`/products/attributes/edit/${finalId}`);
  };

  // View handler
  const handleView = (attribute) => {
      const finalId = attribute.id || attribute._id;
      navigate(`/products/attributes/view/${finalId}`);
    };
  
 

  return (
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search attributes..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>

      {loading && (
       <LoadingData message='Loading data...'/>
      )}

      {!loading && attributes.length === 0 && <DataNotFound />}

      {!loading && attributes.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center whitespace-nowrap">S.No</TableHead>
                <TableHead className="whitespace-nowrap">Attribute Name</TableHead>
                <TableHead className="whitespace-nowrap">Display Type</TableHead>
                <TableHead className="whitespace-nowrap">Categories</TableHead>
                <TableHead className="whitespace-nowrap">Values</TableHead>
                <TableHead className="whitespace-nowrap">Filterable</TableHead>
                <TableHead className="whitespace-nowrap">Required</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Created Date</TableHead>
                <TableHead className="text-center whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributes.map((attribute, index) => (
                <TableRow key={attribute._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {attribute?.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {attribute?.displayType}
                    </div>
                  </TableCell>
                
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {Array.isArray(attribute?.categories)
                        ? attribute.categories
                            .map((c) => (typeof c === 'object' ? c?.name || c?._id : c))
                            .join(', ')
                        : ''}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {Array.isArray(attribute?.values)
                        ? attribute.values
                            .map((v) => (typeof v === 'object' ? v?.value : String(v)))
                            .join(', ')
                        : ''}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    {attribute?.isFilterable ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    {attribute?.isRequired ? 'Yes' : 'No'}
                  </TableCell>
                  
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        attribute.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attribute?.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDateShort(attribute?.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(attribute)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(attribute)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(attribute._id, attribute.name)
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
        title="Delete Attribute"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </TableContainer>
  );
};

AttributeListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default React.memo(AttributeListPage);
