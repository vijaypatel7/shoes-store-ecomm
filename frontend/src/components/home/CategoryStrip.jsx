import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const categories = [
  { name: 'Running', emoji: '🏃', path: '/shop?category=Running' },
  { name: 'Sneakers', emoji: '👟', path: '/shop?category=Sneakers' },
  { name: 'Casual', emoji: '😎', path: '/shop?category=Casual' },
  { name: 'Formal', emoji: '👞', path: '/shop?category=Formal' },
  { name: 'Sports', emoji: '⚽', path: '/shop?category=Sports' },
  { name: 'Boots', emoji: '🥾', path: '/shop?category=Boots' },
  { name: 'Sandals', emoji: '🩴', path: '/shop?category=Sandals' },
  { name: 'Training', emoji: '💪', path: '/shop?category=Training' },
];

const CategoryStrip = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section ref={ref} className="py-8 border-b">
      <div className="container-custom">
        <div className="flex overflow-x-auto no-scrollbar gap-3 lg:gap-4 lg:justify-center">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={cat.path}
                className="flex flex-col items-center gap-2 min-w-[80px] group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-2xl flex items-center justify-center
                    text-2xl lg:text-3xl group-hover:bg-dark-950 group-hover:shadow-xl transition-all duration-300"
                >
                  {cat.emoji}
                </motion.div>
                <span className="text-xs font-medium text-dark-600 group-hover:text-dark-950 whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;