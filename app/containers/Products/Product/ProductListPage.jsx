import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/custom-button';
import productService from '@/api/service/brandService'; // Adjust this import path
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

const ProductListPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [product, setProducts] = useState([]);
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

  // Fetch Products from API with pagination and search
  const fetchProducts = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...(search && { search }),
        };

        const response = await productService.getAll(params);
        if (response?.data?.success) {
          setProducts(response.data.data || []);
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.page || page,
            totalPages:
              response.data.totalPages ||
              Math.ceil(response.data.total / pagination.itemsPerPage),
            totalItems:
              response.data.total ||
              (response.data.data ? response.data.data.length : 0),
          }));
        } else {
          setError('Failed to fetch Product');
        }
      } catch (err) {
        console.error('Error fetching Products:', err);
        setError('Failed to fetch Products');
        toast.error('Failed to load Products');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage],
  );

  // Load Products on mount and when dependencies change
  useEffect(() => {
    fetchProducts(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchProducts, pagination.currentPage, searchTerm]);

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
      fetchProducts(1, term);
    }, 700);
  };

  // Handle delete brand
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
      const response = await productService.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Product deleted successfully!');
          setBrands((prev) => prev.filter((brand) => brand._id !== deleteModal.itemId));
        newTotalItems = pagination.totalItems - 1;
        newTotalPages = Math.max(
          1,
          Math.ceil(newTotalItems / pagination.itemsPerPage),
        );
        setPagination((prev) => ({
          ...prev,
          totalItems: newTotalItems,
          totalPages: newTotalPages,
          currentPage:
            prev.currentPage > newTotalPages ? newTotalPages : prev.currentPage,
        }));
      } else {
        toast.error(response?.data?.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
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
  const handleEdit = (product) => {
    if (product.level !== undefined && product.level !== 0) {
      toast.error('Only main products can be edited from this page');
      return;
    }
    const finalId = product.id || product._id;
    navigate(`/products/products/edit/${finalId}`);
  };

  // View handler
  const handleView = (product) => {
    const finalId = product.id || product._id;
    navigate(`/products/products/view/${finalId}`);
  };

  return (
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>

      {loading && <LoadingData message="Loading data..." />}

      {!loading && product.length === 0 && <DataNotFound />}

      {!loading && product.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>product Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleView(product)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product._id, product.name)}
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

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </TableContainer>
  );
};

ProductListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default ProductListPage;
