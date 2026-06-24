import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const brands = [
  { name: 'Nike', logo: '✓', bg: 'bg-gray-900', text: 'text-white' },
  { name: 'Adidas', logo: '⫽', bg: 'bg-white', text: 'text-black' },
  { name: 'Puma', logo: '🐆', bg: 'bg-red-600', text: 'text-white' },
  { name: 'New Balance', logo: 'NB', bg: 'bg-blue-800', text: 'text-white' },
  { name: 'Jordan', logo: '🏀', bg: 'bg-red-500', text: 'text-white' },
  { name: 'Converse', logo: '⭐', bg: 'bg-white', text: 'text-black' },
  { name: 'Vans', logo: '⬦', bg: 'bg-red-700', text: 'text-white' },
  { name: 'Asics', logo: '⫶', bg: 'bg-blue-600', text: 'text-white' },
];

const BrandShowcase = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-extrabold mb-3">
            Shop by Brand
          </h2>
          <p className="text-dark-500">Your favorite brands, all in one place</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/shop?brand=${encodeURIComponent(brand.name)}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${brand.bg} ${brand.text} rounded-2xl p-8 lg:p-10 text-center
                    cursor-pointer border border-gray-200 shadow-sm hover:shadow-xl transition-shadow`}
                >
                  <div className="text-4xl lg:text-5xl mb-3">{brand.logo}</div>
                  <h3 className="font-display font-bold text-lg">
                    {brand.name}
                  </h3>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;