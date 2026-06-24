import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 bg-white p-3 rounded-xl border"
    >
      {/* Image */}
      <Link
        to={`/product/${item.product?.slug}`}
        className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'}
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">
          {item.product?.brand}
        </p>
        <Link
          to={`/product/${item.product?.slug}`}
          className="text-sm font-medium text-dark-900 line-clamp-2 hover:text-primary-500 transition-colors"
        >
          {item.product?.name}
        </Link>

        <div className="flex items-center gap-3 mt-1 text-xs text-dark-500">
          <span>Size: UK {item.size}</span>
          {item.color?.name && (
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: item.color.hex }}
              />
              {item.color.name}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-sm">
            ₹{(item.price * item.quantity).toLocaleString()}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                item.quantity > 1
                  ? updateItem(item._id, item.quantity - 1)
                  : removeItem(item._id)
              }
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {item.quantity === 1 ? (
                <Trash2 size={12} className="text-red-500" />
              ) : (
                <Minus size={12} />
              )}
            </button>
            <span className="w-8 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateItem(item._id, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;