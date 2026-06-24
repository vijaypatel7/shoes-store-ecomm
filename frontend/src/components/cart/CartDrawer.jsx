import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../ui/Button';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, cartCount, cartTotal, clearCart } =
    useCart();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} />
                <h2 className="text-lg font-display font-bold">
                  Your Cart
                </h2>
                <span className="bg-dark-100 text-dark-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cartCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      damping: 10,
                      delay: 0.2,
                    }}
                  >
                    <ShoppingBag
                      size={64}
                      className="text-dark-200 mb-6"
                      strokeWidth={1}
                    />
                  </motion.div>
                  <h3 className="text-xl font-display font-bold mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-dark-400 text-sm mb-6">
                    Looks like you haven't added anything yet. Start shopping to
                    fill it up!
                  </p>
                  <Button
                    onClick={() => setCartOpen(false)}
                    variant="primary"
                  >
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {cart?.items?.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium mt-4"
                  >
                    <Trash2 size={14} />
                    Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartCount > 0 && (
              <div className="border-t bg-gray-50 p-5 space-y-4">
                {/* Free shipping progress */}
                {cartTotal < 999 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-dark-500">
                        Add ₹{(999 - cartTotal).toLocaleString()} more for
                        FREE shipping
                      </span>
                      <span className="font-semibold">
                        ₹{cartTotal}/₹999
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        className="bg-primary-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((cartTotal / 999) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {cartTotal >= 999 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-4 py-2 rounded-xl">
                    <span>✓</span>
                    You qualify for FREE shipping! 🎉
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-dark-500">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-dark-500">
                    <span>Shipping</span>
                    <span>
                      {cartTotal >= 999 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        '₹49'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>
                      ₹
                      {(
                        cartTotal + (cartTotal >= 999 ? 0 : 49)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                >
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    icon={<ArrowRight size={18} />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;