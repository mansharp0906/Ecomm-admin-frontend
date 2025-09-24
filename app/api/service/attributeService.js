// src/api/services/attributeService.js
import api from '../request';

const attributeService = {
  // Get all attributes with pagination and search support
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type); // optional filter

    const queryString = queryParams.toString();
    const url = queryString ? `/attributes?${queryString}` : '/attributes';

    return api.get(url);
  },

  getById: (id) => api.get(`/attributes/${id}`),
  create: (data) => api.post('/attributes', data),
  update: (id, data) => api.put(`/attributes/${id}`, data),
  delete: (id) => api.delete(`/attributes/${id}`),
  bulkDelete: (ids) => api.post('/attributes/bulk-delete', { ids }),
};

export default attributeService;
