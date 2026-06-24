import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const Cart = () => {
  const { cart, loading, clearCart } = useCart();
  const cartItems = cart?.items || [];
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-dark-950 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-display font-bold">
                  Shopping Cart
                </h1>
                <p className="text-sm text-dark-400 mt-0.5">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium
                  transition-colors hidden sm:block"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-dark-300" />
            </div>
            <h2 className="text-2xl font-display font-bold text-dark-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-dark-400 mb-8 max-w-xs">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3 bg-dark-950 text-white rounded-full font-medium
                hover:bg-dark-800 transition-colors"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem
                    key={`${item.product._id}-${item.size}`}
                    item={item}
                  />
                ))}
              </AnimatePresence>            

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/shop")}
                className="flex items-center gap-2 text-sm text-dark-500
                  hover:text-dark-900 transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
