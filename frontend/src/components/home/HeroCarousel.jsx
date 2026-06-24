import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Step Into',
    highlight: 'Greatness',
    subtitle: 'New arrivals from top brands. Find your perfect pair.',
    cta: 'Shop New Arrivals',
    link: '/shop?newArrival=true',
    bg: 'from-orange-50 to-amber-50',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    color: 'text-primary-500',
  },
  {
    id: 2,
    title: 'Run Your',
    highlight: 'Own Race',
    subtitle: 'Performance running shoes designed for champions.',
    cta: 'Shop Running',
    link: '/shop?category=Running',
    bg: 'from-blue-50 to-indigo-50',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    color: 'text-blue-500',
  },
  {
    id: 3,
    title: 'Street',
    highlight: 'Culture',
    subtitle: 'Iconic sneakers that define generations.',
    cta: 'Shop Sneakers',
    link: '/shop?category=Sneakers',
    bg: 'from-purple-50 to-pink-50',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
    color: 'text-purple-500',
  },
  {
    id: 4,
    title: 'Mega',
    highlight: 'Sale',
    subtitle: 'Up to 50% off on selected styles. Limited time only.',
    cta: 'Shop Sale',
    link: '/shop?sort=price_asc',
    bg: 'from-red-50 to-orange-50',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
    color: 'text-red-500',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`bg-gradient-to-br ${slide.bg} min-h-[60vh] lg:min-h-[80vh] relative`}
        >
          <div className="container-custom h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16 lg:py-0">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative z-10"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-semibold uppercase tracking-widest text-dark-500 mb-4"
                >
                  New Collection 2024
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-5xl sm:text-6xl lg:text-8xl font-display font-extrabold leading-[0.9] mb-6"
                >
                  {slide.title}
                  <br />
                  <span className={slide.color}>{slide.highlight}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-dark-500 text-lg max-w-md mb-8"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to={slide.link}>
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary text-lg group"
                    >
                      {slide.cta}
                      <ArrowRight
                        size={20}
                        className="inline ml-2 transition-transform group-hover:translate-x-1"
                      />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  type: 'spring',
                }}
                className="relative flex items-center justify-center"
              >
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full max-w-lg lg:max-w-xl object-contain drop-shadow-2xl"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Decorative circle */}
                <div className="absolute w-[120%] h-[120%] rounded-full border-2 border-black/5 -z-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full
              ${
                i === current
                  ? 'w-8 h-2 bg-dark-950'
                  : 'w-2 h-2 bg-dark-300 hover:bg-dark-500'
              }`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full
          flex items-center justify-center hover:bg-white transition-colors z-20 hidden lg:flex shadow-lg"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full
          flex items-center justify-center hover:bg-white transition-colors z-20 hidden lg:flex shadow-lg"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
};

export default HeroCarousel;