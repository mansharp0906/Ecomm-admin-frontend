// src/api/services/categoryService.js
import api from '../request';

const categoryService = {
  // Get all categories with pagination and search support
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.level !== undefined) queryParams.append('level', params.level);

    const queryString = queryParams.toString();
    const url = queryString ? `/categories?${queryString}` : '/categories';

    return api.get(url);
  },

  getById: (id) => api.get(`/categories/${id}`),
  getTree: () => api.get('/categories/tree'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  bulkDelete: (ids) => api.post('/categories/bulk-delete', { ids }),
};

export default categoryService;
