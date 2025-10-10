import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
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
} from '@/components';
import shopIdServices from '@/api/service/shopServices';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@/components/custom-table/tooltip';

function ShopIdListPage({ refreshTrigger }) {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 5,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: '',
    isLoading: false,
  });

  const filteredShops = useMemo(() => {
    if (!searchTerm) return shops;
    return shops.filter((shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [shops, searchTerm]);

  const fetchShops = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...(search && { search }),
        };
        const response = await shopIdServices.getAll(params);
        if (response?.data?.success) {
          setShops(response.data.data.shops || []);
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.page || page,
            totalPages:
              response.data.totalPages ||
              Math.ceil(response.data.total / pagination.itemsPerPage),
            totalItems:
              response.data.total || response.data.data.shops?.length || 0,
          }));
        } else {
          toast.error('Failed to fetch shops');
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
        toast.error('Failed to load shops');
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage],
  );

  useEffect(() => {
    fetchShops(pagination.currentPage, searchTerm);
  }, [refreshTrigger, fetchShops, pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchShops(page, searchTerm);
  };

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchShops(1, term);
      }, 700);
    },
    [fetchShops],
  );

  const handleDelete = useCallback((id, name) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemName: name,
      isLoading: false,
    });
  }, []);

  const confirmDelete = async () => {
    if (!deleteModal.itemId) return;
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await shopIdServices.delete(deleteModal.itemId);
      if (response?.data?.success) {
        toast.success('Shop deleted successfully!');
        setPagination((prev) => {
          const newTotalItems = prev.totalItems - 1;
          const newTotalPages = Math.ceil(newTotalItems / prev.itemsPerPage);
          let newCurrentPage = prev.currentPage;
          if (newCurrentPage > newTotalPages && newTotalPages > 0) {
            newCurrentPage = newTotalPages;
          }
          fetchShops(newCurrentPage, searchTerm);
          return {
            ...prev,
            currentPage: newCurrentPage,
            totalItems: newTotalItems,
            totalPages: newTotalPages,
          };
        });
      } else {
        toast.error(response?.data?.message || 'Failed to delete shop');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete shop');
    } finally {
      setDeleteModal({
        isOpen: false,
        itemId: null,
        itemName: '',
        isLoading: false,
      });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemName: '',
      isLoading: false,
    });
  };

  const handleView = (shop) => {
    const finalId = shop.id || shop._id;
    navigate(`/shop/view/${finalId}`);
  };
  const handleEdit = (shop) => {
    const finalId = shop.id || shop._id;
    navigate(`/shop/edit/${finalId}`);
  };

  return (
    <TableContainer>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search shops..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          className="w-full"
        />
      </SearchBarContainer>
      {loading && <LoadingData message="Loading data..." />}
      {!loading && shops.length === 0 && <DataNotFound />}
      {!loading && shops.length > 0 && (
        <div className="overflow-x-auto">
          <Table className="min-w-full w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Social Media</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Auto Approve</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops.map((shop, index) => (
                <TableRow key={shop._id}>
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.itemsPerPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-12 h-12 mx-auto">
                      {shop.banner ? (
                        <img
                          src={shop.banner}
                          alt={shop.name}
                          className="h-12 w-12 object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Fallback */}
                      <div className="hidden h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center absolute top-0 left-0">
                        <CustomIcon type="logo" size={6} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-12 h-12 mx-auto">
                      {shop.logo ? (
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="h-12 w-12 object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Fallback */}
                      <div className="hidden h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center absolute top-0 left-0">
                        <CustomIcon type="logo" size={6} />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{shop.name}</TableCell>
                  <TableCell className="text-gray-500 max-w-[250px]">
                    <div
                      className="truncate block cursor-pointer max-w-[250px]"
                      data-tooltip-id={`desc-tooltip-${shop._id}`}
                      data-tooltip-content={shop.description}
                    >
                      {shop.description}
                    </div>
                    <Tooltip
                      id={`desc-tooltip-${shop._id}`}
                      content={shop.description}
                      place="bottom"
                      variant=""
                      noArrow={false}
                      className="max-w-xs bg-white bg-opacity-90 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-md opacity-95 whitespace-normal break-words"
                    />
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-[200px]">
                    <div
                      className="truncate block cursor-pointer max-w-[200px]"
                      data-tooltip-id={`email-tooltip-${shop._id}`}
                      data-tooltip-content={shop.contact?.email || '-'}
                    >
                      {shop.contact?.email || '-'}
                    </div>
                    <Tooltip
                      id={`email-tooltip-${shop._id}`}
                      content={shop.contact?.email || '-'}
                      place="bottom"
                      className="max-w-xs bg-white bg-opacity-90 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-md opacity-95 whitespace-normal break-words"
                    />
                  </TableCell>

                  <TableCell>{shop.contact?.phone?.trim() || '-'}</TableCell>
                  <TableCell className="text-gray-500 max-w-[250px]">
                    <div
                      className="truncate block cursor-pointer max-w-[250px]"
                      data-tooltip-id={`address-tooltip-${shop._id}`}
                      data-tooltip-content={(() => {
                        const address = [
                          shop.contact?.address?.street,
                          shop.contact?.address?.city,
                          shop.contact?.address?.state,
                          shop.contact?.address?.country,
                          shop.contact?.address?.zipCode,
                        ]
                          .filter(Boolean)
                          .join(', ');
                        return address || '-';
                      })()}
                    >
                      {[
                        shop.contact?.address?.street,
                        shop.contact?.address?.city,
                        shop.contact?.address?.state,
                        shop.contact?.address?.country,
                        shop.contact?.address?.zipCode,
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </div>

                    <Tooltip
                      id={`address-tooltip-${shop._id}`}
                      content={(() => {
                        const address = [
                          shop.contact?.address?.street,
                          shop.contact?.address?.city,
                          shop.contact?.address?.state,
                          shop.contact?.address?.country,
                          shop.contact?.address?.zipCode,
                        ]
                          .filter(Boolean)
                          .join(', ');
                        return address || '-';
                      })()}
                      place="bottom"
                      variant=""
                      noArrow={false}
                      className="max-w-xs bg-white bg-opacity-90 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-md opacity-95 whitespace-normal break-words"
                    />
                  </TableCell>

                  <TableCell className="text-gray-500 max-w-[250px]">
                    <div
                      className="truncate block cursor-pointer max-w-[250px]"
                      data-tooltip-id={`social-tooltip-${shop._id}`}
                      data-tooltip-content={(() => {
                        const social = [
                          `Website: ${
                            shop.socialMedia?.wabsite?.trim() || '-'
                          }`,
                          `Facebook: ${
                            shop.socialMedia?.facebook?.trim() || '-'
                          }`,
                          `Instagram: ${
                            shop.socialMedia?.instagram?.trim() || '-'
                          }`,
                        ].join('\n');
                        return social;
                      })()}
                    >
                      Website: {shop.socialMedia?.website?.trim() || '-'}
                      <br />
                      Facebook: {shop.socialMedia?.facebook?.trim() || '-'}
                      <br />
                      Instagram: {shop.socialMedia?.instagram?.trim() || '-'}
                    </div>

                    <Tooltip
                      id={`social-tooltip-${shop._id}`}
                      content={(() => {
                        const social = [
                          `Website: ${
                            shop.socialMedia?.website?.trim() || '-'
                          }`,
                          `Facebook: ${
                            shop.socialMedia?.facebook?.trim() || '-'
                          }`,
                          `Instagram: ${
                            shop.socialMedia?.instagram?.trim() || '-'
                          }`,
                        ].join('\n');
                        return social;
                      })()}
                      place="bottom"
                      className="whitespace-pre-line max-w-xs bg-white bg-opacity-90 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-md opacity-95 break-words"
                    />
                  </TableCell>

                  <TableCell>{shop.settings?.commissionRate}</TableCell>
                  <TableCell>
                    {shop.settings?.autoApproveProducts ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(shop)}
                        title="View"
                      >
                        <CustomIcon type="view" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(shop)}
                        title="Edit"
                      >
                        <CustomIcon type="edit" size={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(shop._id, shop.name)}
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
        title="Delete Shop"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        itemName={deleteModal.itemName}
        isLoading={deleteModal.isLoading}
      />
    </TableContainer>
  );
}

ShopIdListPage.propTypes = {
  refreshTrigger: PropTypes.number.isRequired,
};

export default ShopIdListPage;
