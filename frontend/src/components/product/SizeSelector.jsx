import { motion } from 'framer-motion';

const SizeSelector = ({ sizes, selectedSize, onSelect }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Select Size</h3>
        <button className="text-xs text-primary-500 font-medium hover:underline">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
        {sizes?.map(({ size, stock }) => (
          <motion.button
            key={size}
            whileTap={{ scale: 0.95 }}
            disabled={stock === 0}
            onClick={() => onSelect(size)}
            className={`relative py-3 rounded-xl text-sm font-medium transition-all border-2
              ${
                selectedSize === size
                  ? 'border-dark-950 bg-dark-950 text-white'
                  : stock === 0
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 hover:border-dark-400 text-dark-700'
              }`}
          >
            UK {size}
            {stock > 0 && stock <= 3 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;