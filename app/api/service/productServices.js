// src/api/services/productServices.js
import api from '../request';

const productServices = {
  // Get all products with pagination and search support
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.brand) queryParams.append('brand', params.brand);

    const queryString = queryParams.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    return api.get(url);
  },

  getById: (id) => api.get(`/products/${id}`),

  // Create product
  create: (data) => {
    // Check if data is FormData to set appropriate headers
    if (data instanceof FormData) {
      return api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/products', data);
  },

  // Update product
  update: (id, data) => {
    // Check if data is FormData to set appropriate headers
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/products/${id}`, data);
  },

  delete: (id) => api.delete(`/products/${id}`),

  bulkDelete: (ids) => api.post('/products/bulk-delete', { ids }),

  // Get products by category
  getByCategory: (categoryId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/products/category/${categoryId}?${queryString}`
      : `/products/category/${categoryId}`;
    return api.get(url);
  },

  // Get products by brand
  getByBrand: (brandId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/products/brand/${brandId}?${queryString}`
      : `/products/brand/${brandId}`;
    return api.get(url);
  },

  // Get featured products
  getFeatured: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/products/featured?${queryString}`
      : '/products/featured';
    return api.get(url);
  },

  // Update product status
  updateStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),

  // Toggle featured status
  toggleFeatured: (id) => api.patch(`/products/${id}/featured`),

  // Get product statistics
  getStats: () => api.get('/products/stats'),

  // Export products
  exportProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.format) queryParams.append('format', params.format);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.brand) queryParams.append('brand', params.brand);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/products/export?${queryString}`
      : '/products/export';
    return api.get(url, { responseType: 'blob' });
  },
};

export default productServices;
