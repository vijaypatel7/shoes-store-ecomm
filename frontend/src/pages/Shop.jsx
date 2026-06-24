/* import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import API from '../api/axios';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filters = Object.fromEntries(searchParams.entries());

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products', { params: filters });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newFilters };

    // Remove undefined/empty values
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  const handleSort = (value) => {
    handleFilterChange({ sort: value });
    setSortOpen(false);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (k) => !['page', 'limit', 'sort', 'search'].includes(k) && filters[k]
  ).length;


  return (
    <div className="min-h-screen bg-gray-50/50">

      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-display font-bold">
                {filters.search
                  ? `Results for "${filters.search}"`
                  : filters.brand
                    ? filters.brand
                    : 'All Shoes'}
              </h1>
              <p className="text-sm text-dark-400 mt-0.5">
                {pagination.total || 0} products found
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-950 text-white rounded-full text-sm font-medium"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm font-medium hover:border-dark-300"
                >
                  Sort
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border py-2 z-50"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSort(option.value)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                            ${filters.sort === option.value ? 'font-semibold text-primary-500' : 'text-dark-700'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobile={false}
            />
          </div>

          <div className="flex-1">
            <ProductGrid products={products} loading={loading} />

            </div>

            */
           import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import API from '../api/axios';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filters = Object.fromEntries(searchParams.entries());

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products', { params: filters });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortOpen && !e.target.closest('[data-sort-dropdown]')) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sortOpen]);

  const handleFilterChange = (newFilters) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newFilters, page: 1 }; // Reset to page 1 on filter change

    // Remove undefined/empty values
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  const handleSort = (value) => {
    handleFilterChange({ sort: value });
    setSortOpen(false);
  };

  const handlePageChange = (page) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllFilters = () => {
    const kept = {};
    if (filters.search) kept.search = filters.search;
    if (filters.sort) kept.sort = filters.sort;
    setSearchParams(kept);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (k) => !['page', 'limit', 'sort', 'search'].includes(k) && filters[k]
  ).length;

  const currentPage = parseInt(filters.page || '1', 10);
  const totalPages = pagination.totalPages || 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-display font-bold">
                {filters.search
                  ? `Results for "${filters.search}"`
                  : filters.brand
                    ? filters.brand
                    : 'All Shoes'}
              </h1>
              <p className="text-sm text-dark-400 mt-0.5">
                {pagination.total || 0} products found
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-950 text-white rounded-full text-sm font-medium"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative" data-sort-dropdown>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm font-medium hover:border-dark-300 transition-colors"
                >
                  {sortOptions.find((o) => o.value === filters.sort)?.label || 'Sort'}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border py-2 z-50"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSort(option.value)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                            ${filters.sort === option.value
                              ? 'font-semibold text-primary-500'
                              : 'text-dark-700'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {Object.entries(filters)
                .filter(([k]) => !['page', 'limit', 'sort', 'search'].includes(k))
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="flex items-center gap-1.5 px-3 py-1 bg-dark-950 text-white text-xs rounded-full"
                  >
                    <span className="capitalize">{key}:</span>
                    <span className="font-medium">{value}</span>
                    <button
                      onClick={() => handleFilterChange({ [key]: '' })}
                      className="hover:text-gray-300 transition-colors ml-0.5"
                      aria-label={`Remove ${key} filter`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobile={false}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full border text-sm font-medium
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:bg-dark-950 hover:text-white hover:border-dark-950
                    transition-colors duration-200"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span
                        key={`dots-${idx}`}
                        className="px-2 py-2 text-sm text-dark-400 select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-colors duration-200
                          ${currentPage === page
                            ? 'bg-dark-950 text-white'
                            : 'border hover:bg-gray-100 text-dark-700'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full border text-sm font-medium
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:bg-dark-950 hover:text-white hover:border-dark-950
                    transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="text-6xl mb-4">👟</div>
                <h3 className="text-xl font-display font-bold text-dark-900 mb-2">
                  No products found
                </h3>
                <p className="text-dark-400 text-sm mb-6 max-w-xs">
                  Try adjusting your filters or search term to find what you're
                  looking for.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-6 py-2.5 bg-dark-950 text-white rounded-full text-sm font-medium
                    hover:bg-dark-800 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden
                flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs w-5 h-5 rounded-full
                      flex items-center justify-center font-medium">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Filters Content */}
              <div className="flex-1 overflow-y-auto">
                <ProductFilters
                  filters={filters}
                  onFilterChange={(f) => {
                    handleFilterChange(f);
                  }}
                  isMobile={true}
                />
              </div>

              {/* Drawer Footer */}
              <div className="border-t p-4 flex gap-3">
                <button
                  onClick={handleClearAllFilters}
                  className="flex-1 py-2.5 border border-dark-300 rounded-full text-sm
                    font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 py-2.5 bg-dark-950 text-white rounded-full text-sm
                    font-medium hover:bg-dark-800 transition-colors"
                >
                  View {pagination.total || 0} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;