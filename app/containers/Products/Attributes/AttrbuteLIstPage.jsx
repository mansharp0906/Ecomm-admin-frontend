import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/custom-button';
import attributeService from '@/api/service/attributesServices'; // Make sure this is correct!
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
import { LoadingData } from '@/components/custom-pages';

const AttributeListPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
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

        const response = await attributeService.getAll(params);
        if (response?.data?.success) {
          setAttributes(response.data.data || []);
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.page || page,
            totalPages:
              response.data.totalPages ||
              Math.ceil(response.data.total / pagination.itemsPerPage),
            totalItems: response.data.total || (response.data.data ? response.data.data.length : 0),
          }));
        } else {
          setError('Failed to fetch attributes');
        }
      } catch (err) {
        console.error('Error fetching attributes:', err);
        setError('Failed to fetch attributes');
        toast.error('Failed to load attributes');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage]
  );

  // Load attributes on mount and when dependencies change
  useEffect(() => {
    fetchAttributes(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchAttributes, pagination.currentPage, searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handle search - debounced API call
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchAttributes(1, term);
    }, 700);
  };

  // Handle delete attribute
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
      const response = await attributeService.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Attribute deleted successfully!');
        setAttributes((prev) => prev.filter((attribute) => attribute._id !== deleteModal.itemId));
        const newTotalItems = pagination.totalItems - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotalItems / pagination.itemsPerPage));
        setPagination((prev) => ({
          ...prev,
          totalItems: newTotalItems,
          totalPages: newTotalPages,
          currentPage: prev.currentPage > newTotalPages ? newTotalPages : prev.currentPage,
        }));
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
        <LoadingData message='loadind data...'/>
      )}

      {!loading && attributes.length === 0 && <DataNotFound />}

      {!loading && attributes.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Attribute Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributes.map((attribute, index) => (
                <TableRow key={attribute._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {attribute.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">{attribute.description}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        attribute.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attribute.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(attribute.createdAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleDelete(attribute._id, attribute.name)}
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

export default AttributeListPage;
