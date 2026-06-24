import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, ...params };
      const { data } = await API.get('/products', { params: queryParams });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  };

  return {
    products,
    loading,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refetch: fetchProducts,
  };
};