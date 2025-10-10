// src/api/services/shopService.js
import api from '../request';

const shopService = {
  // Get all shops with pagination and search support
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.vendorId) queryParams.append('vendorId', params.vendorId);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/shops/my-shops?${queryString}`
      : '/shops/my-shops';

    return api.get(url);
  },

  // Get shop by ID
  getById: (id) => api.get(`/shops/${id}`),

  // Create a new shop (supports FormData for images, etc.)
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/shops', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/shops', data);
  },

  // Update shop by ID
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/shops/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/shops/${id}`, data);
  },

  // Delete shop by ID
  delete: (id) => api.delete(`/shops/${id}`),
};

export default shopService;
