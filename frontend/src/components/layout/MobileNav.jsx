import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User, Grid3X3 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MobileNav = () => {
  const location = useLocation();
  const { cartCount, setCartOpen } = useCart();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'Shop', path: '/shop' },
    { icon: Search, label: 'Search', path: '/shop?search=true' },
    {
      icon: ShoppingBag,
      label: 'Cart',
      action: () => setCartOpen(true),
      badge: cartCount,
    },
    {
      icon: User,
      label: 'Account',
      path: user ? '/profile' : '/login',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 px-4 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ icon: Icon, label, path, action, badge }) => {
            const isActive = path && location.pathname === path;
            const Component = path ? Link : 'button';

            return (
              <Component
                key={label}
                to={path}
                onClick={action}
                className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={
                      isActive ? 'text-dark-950' : 'text-dark-400'
                    }
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  {badge > 0 && (
                    <motion.span
                      key={badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[9px]
                        font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {badge}
                    </motion.span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? 'text-dark-950' : 'text-dark-400'
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-dark-950 rounded-full"
                  />
                )}
              </Component>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;