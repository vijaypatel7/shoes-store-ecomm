import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-[10rem] font-display font-black text-gray-100 leading-none select-none">
            404
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl -mt-8"
          >
            👟
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-display font-bold text-dark-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-dark-400 mb-8 text-base leading-relaxed">
            Looks like this page stepped out. The page you're looking for
            doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 border border-dark-200 rounded-full
              text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto
              justify-center"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-dark-950 text-white rounded-full
              text-sm font-medium hover:bg-dark-800 transition-colors w-full sm:w-auto
              justify-center"
          >
            <Home size={16} />
            Go Home
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-full
              text-sm font-medium hover:bg-primary-600 transition-colors w-full sm:w-auto
              justify-center"
          >
            <Search size={16} />
            Browse Shop
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;