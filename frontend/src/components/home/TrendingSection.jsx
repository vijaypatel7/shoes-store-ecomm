import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AnimatedCounter from '../ui/AnimatedCounter';

const TrendingSection = () => {
  const [ref, isVisible] = useScrollAnimation();

  const stats = [
    { value: 500, suffix: '+', label: 'Products' },
    { value: 15, suffix: '+', label: 'Brands' },
    { value: 50000, suffix: '+', label: 'Happy Customers' },
    { value: 4.8, suffix: '⭐', label: 'Average Rating' },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-dark-950 text-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-primary-400 mb-6">
              <TrendingUp size={20} />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Trending Now
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
              Find Your
              <br />
              <span className="text-primary-500">Perfect Fit</span>
            </h2>

            <p className="text-dark-400 text-lg max-w-lg mb-8">
              From the streets to the track, find shoes that match your vibe.
              Over 500+ styles from the world's best brands.
            </p>

            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg
                  hover:bg-primary-600 transition-all inline-flex items-center gap-2 group
                  shadow-lg shadow-primary-500/30"
              >
                Explore Collection
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 lg:p-8
                  hover:bg-white/10 transition-all"
              >
                <div className="text-3xl lg:text-4xl font-display font-extrabold text-primary-400 mb-2">
                  {isVisible && (
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <p className="text-dark-400 text-sm font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;