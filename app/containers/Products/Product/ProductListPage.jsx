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
import productServices from '@/api/service/productServices';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@/components/custom-table/tooltip';

const ProductListPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
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

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  // Fetch Products from API with pagination and search
  const fetchProductData = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          level: 0, // Only main categories
          ...(search && { search: search }),
        };

        const response = await productServices.getAll(params);
        
        // Check if response is successful
        if (response?.data?.success || (response?.status >= 200 && response?.status < 300)) {
          // Use data directly from API (backend should return only level 0 categories)
          const productsData = response.data?.data || response.data || [];
          setProducts(Array.isArray(productsData) ? productsData : []);

          // Update pagination state from API response (backend handles pagination)
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data?.page || page,
            totalPages:
              response.data?.totalPages ||
              Math.ceil((response.data?.total || productsData.length) / pagination.itemsPerPage),
            totalItems: response.data?.total || productsData.length,
          }));

          // Clear any previous errors since we got a successful response
          setError(null);
        } else {
          // Only show error if response indicates failure
          const errorMessage = response?.data?.message || 'Failed to fetch Products';
          setError(errorMessage);
          // No toast message for empty data
        }
      } catch (err) {
        console.error('Error fetching Products:', err);
        setError('Failed to fetch Products');
        // No toast message for errors
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage],
  );

  // Load Products on mount and when dependencies change
  useEffect(() => {
    fetchProductData(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchProductData, pagination.currentPage, searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
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
        fetchProductData(1, term);
      }, 700);
    },
    [fetchProductData],
  );

  // Handle delete product
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
      const response = await productServices.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Product deleted successfully!');
        setProducts((prev) =>
          prev.filter((product) => product._id !== deleteModal.itemId),
        );
        const newTotalItems = pagination.totalItems - 1;
        const newTotalPages = Math.max(
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

      {!loading && products.length === 0 && <DataNotFound />}

      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Product Name</TableHead>
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
                  <TableCell className="text-gray-500 max-w-[250px]">
                    <div
                      className="truncate block cursor-pointer max-w-[250px]"
                      data-tooltip-id={`desc-tooltip-${product._id}`}
                      data-tooltip-content={product.description}
                    >
                      {product.description}
                    </div>
                    <Tooltip
                      id={`desc-tooltip-${product._id}`}
                      content={product.description}
                      place="bottom"
                      variant=""
                      noArrow={false}
                      className="max-w-xs bg-white bg-opacity-90 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-md opacity-95 whitespace-normal break-words"
                    />
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
