import { motion } from 'framer-motion';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-3 border-dark-200 border-t-dark-950 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ borderWidth: '3px' }}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.h1
        className="text-4xl font-display font-bold mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        SOLE<span className="text-primary-500">STORE</span>
      </motion.h1>
      <Loader />
    </motion.div>
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden">
    <div className="aspect-square shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 shimmer rounded" />
      <div className="h-4 w-3/4 shimmer rounded" />
      <div className="h-4 w-1/2 shimmer rounded" />
    </div>
  </div>
);

export default Loader;