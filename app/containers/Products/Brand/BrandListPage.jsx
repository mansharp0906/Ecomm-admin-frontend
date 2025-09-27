import { Button, Pagination, SearchBar, DeleteConfirmationModal, SearchBarContainer, LoadingData, Container, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableContainer, DataNotFound, CustomIcon } from '@/components';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import brandService from '@/api/service/brandService'; // Adjust this import path
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';



import { useNavigate } from 'react-router-dom';

const BrandListPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
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

  // Memoize filtered brands
  const filteredBrands = useMemo(() => {
    if (!searchTerm) return brands;
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  // Fetch brands from API with pagination and search
  const fetchBrands = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...(search && { search }),
        };

        const response = await brandService.getAll(params);
        
        // Debug logging
        console.log('Brand API Response:', response);
        console.log('Response data:', response?.data);
        
        // Handle different response structures
        if (response?.data?.success) {
          // Standard success response
          setBrands(response.data.data || []);
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.page || page,
            totalPages:
              response.data.totalPages ||
              Math.ceil(response.data.total / pagination.itemsPerPage),
            totalItems: response.data.total || (response.data.data ? response.data.data.length : 0),
          }));
        } else if (Array.isArray(response?.data)) {
          // Direct array response (like the API you showed)
          setBrands(response.data);
          setPagination((prev) => ({
            ...prev,
            currentPage: page,
            totalPages: 1,
            totalItems: response.data.length,
          }));
        } else {
          console.error('Unexpected response structure:', response?.data);
          setError('Failed to fetch brands - unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to fetch brands');
        toast.error('Failed to load brands');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage]
  );

  // Load brands on mount and when dependencies change
  useEffect(() => {
    fetchBrands(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchBrands, pagination.currentPage, searchTerm]);

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
      fetchBrands(1, term);
    }, 700);
  }, [fetchBrands]);

  // Handle delete brand
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
      const response = await brandService.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Brand deleted successfully!');
        setBrands((prev) => prev.filter((brand) => brand._id !== deleteModal.itemId));
        const newTotalItems = pagination.totalItems - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotalItems / pagination.itemsPerPage));
        setPagination((prev) => ({
          ...prev,
          totalItems: newTotalItems,
          totalPages: newTotalPages,
          currentPage: prev.currentPage > newTotalPages ? newTotalPages : prev.currentPage,
        }));
      } else {
        toast.error(response?.data?.message || 'Failed to delete brand');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete brand');
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
  const handleEdit = (brand) => {
    if (brand.level !== undefined && brand.level !== 0) {
      toast.error('Only main brands can be edited from this page');
      return;
    }
    const finalId = brand.id || brand._id;
    navigate(`/products/brands/edit/${finalId}`);
  };

  // View handler
   const handleView = (brand) => {
     const finalId = brand.id || brand._id;
     navigate(`/products/brands/view/${finalId}`);
   };
 


  return (
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search brands..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>

      {loading && <LoadingData message="Loading data..." />}

      {!loading && brands.length === 0 && <DataNotFound />}

      {!loading && brands.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand, index) => (
                <TableRow key={brand._id}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-10 h-10 object-cover rounded-full mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    {!brand.logo && (
                      <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500 text-xs">
                        No Logo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {brand.banner ? (
                      <img
                        src={brand.banner}
                        alt={`${brand.name} banner`}
                        className="w-16 h-10 object-cover rounded mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    {!brand.banner && (
                      <div className="w-16 h-10 bg-gray-200 rounded mx-auto flex items-center justify-center text-gray-500 text-xs">
                        No Banner
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{brand.name}</TableCell>
                  <TableCell className="text-gray-500 max-w-xs">
                    <div className="break-words whitespace-normal">{brand.description}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        brand.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {brand.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(brand.createdAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleView(brand)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(brand)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(brand._id, brand.name)}
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
        title="Delete Brand"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </TableContainer>
  );
};

BrandListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default React.memo(BrandListPage);
