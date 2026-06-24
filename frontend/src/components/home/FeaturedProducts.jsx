import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import ProductGrid from '../product/ProductGrid';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const FeaturedProducts = () => {
  const [data, setData] = useState({
    featured: [],
    newArrivals: [],
    bestsellers: [],
  });
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data: res } = await API.get('/products/featured');
        setData({
          featured: res.featured,
          newArrivals: res.newArrivals,
          bestsellers: res.bestsellers,
        });
      } catch (error) {
        console.error('Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const tabs = [
    { id: 'featured', label: 'Featured' },
    { id: 'newArrivals', label: 'New Arrivals' },
    { id: 'bestsellers', label: 'Bestsellers' },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold mb-4">
            Our <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-dark-500 max-w-md mx-auto">
            Handpicked styles curated just for you. From daily essentials to
            statement pieces.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeTab === tab.id ? 'text-white' : 'text-dark-600 hover:text-dark-900'}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-dark-950 rounded-full"
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <ProductGrid products={data[activeTab]} loading={loading} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          className="text-center mt-10"
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary group"
            >
              View All Products
              <ArrowRight
                size={18}
                className="inline ml-2 transition-transform group-hover:translate-x-1"
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;