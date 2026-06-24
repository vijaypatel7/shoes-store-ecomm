import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import API from '../../api/axios';

const ProductFilters = ({ filters, onFilterChange, onClose, isMobile }) => {
  const [availableFilters, setAvailableFilters] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    category: true,
    gender: true,
    price: true,
    size: true,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await API.get('/products/filters');
        setAvailableFilters(data.filters);
      } catch (error) {
        console.error('Failed to fetch filters');
      }
    };
    fetchFilters();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMultiFilter = (key, value) => {
    const currentValues = filters[key]
      ? filters[key].split(',')
      : [];
    const index = currentValues.indexOf(value);
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    onFilterChange({ [key]: currentValues.join(',') || undefined });
  };

  const isSelected = (key, value) => {
    return filters[key]?.split(',').includes(value);
  };

  const clearAllFilters = () => {
    onFilterChange({
      brand: undefined,
      category: undefined,
      gender: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    (k) =>
      !['page', 'limit', 'sort', 'search'].includes(k) && filters[k]
  );

  if (!availableFilters) return null;

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between text-sm font-semibold uppercase tracking-wider mb-3"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={`${isMobile ? '' : 'sticky top-24'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <h3 className="font-display font-bold text-lg">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary-500 font-semibold hover:underline"
            >
              Clear all
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} className="p-1">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Brand */}
      <FilterSection title="Brand" section="brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableFilters.brands.map((brand) => (
            <label
              key={brand}
                onClick={() => handleMultiFilter('brand', brand)}

              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                  ${
                    isSelected('brand', brand)
                      ? 'bg-dark-950 border-dark-950'
                      : 'border-gray-300 group-hover:border-dark-400'
                  }`}
              >
                {isSelected('brand', brand) && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-dark-700 group-hover:text-dark-950"
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" section="category">
        <div className="flex flex-wrap gap-2">
          {availableFilters.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleMultiFilter('category', cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  isSelected('category', cat)
                    ? 'bg-dark-950 text-white'
                    : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender" section="gender">
        <div className="flex flex-wrap gap-2">
          {availableFilters.genders.map((gen) => (
            <button
              key={gen}
              onClick={() => handleMultiFilter('gender', gen)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  isSelected('gender', gen)
                    ? 'bg-dark-950 text-white'
                    : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                }`}
            >
              {gen}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price" section="price">
        <div className="space-y-2">
          {[
            { label: 'Under ₹2,000', min: 0, max: 2000 },
            { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
            { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
            { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
            { label: 'Above ₹20,000', min: 20000, max: 100000 },
          ].map(({ label, min, max }) => (
            <button
              key={label}
              onClick={() => onFilterChange({ minPrice: min, maxPrice: max })}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                ${
                  Number(filters.minPrice) === min && Number(filters.maxPrice) === max
                    ? 'bg-dark-950 text-white'
                    : 'hover:bg-gray-100 text-dark-600'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size" section="size">
        <div className="grid grid-cols-4 gap-2">
          {availableFilters.sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleMultiFilter('size', String(size))}
              className={`py-2 rounded-lg text-sm font-medium transition-all
                ${
                  isSelected('size', String(size))
                    ? 'bg-dark-950 text-white'
                    : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default ProductFilters;