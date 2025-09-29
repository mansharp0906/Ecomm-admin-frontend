// src/api/services/brandService.js
import api from '../request';

const brandService = {
  // Get all brands with pagination and search support
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = queryString ? `/brands?${queryString}` : '/brands';

    return api.get(url);
  },

  // Get brands for a specific category with pagination/search
  getByCategory: (categoryId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/brands/category/${categoryId}?${queryString}`
      : `/brands/category/${categoryId}`;
    return api.get(url);
  },

  getById: (id) => api.get(`/brands/${id}`),

  // Create brand with FormData support for file uploads
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/brands', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/brands', data);
  },

  // Update brand with FormData support for file uploads
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/brands/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/brands/${id}`, data);
  },

  delete: (id) => api.delete(`/brands/${id}`),
  bulkDelete: (ids) => api.post('/brands/bulk-delete', { ids }),
};

export default brandService;
