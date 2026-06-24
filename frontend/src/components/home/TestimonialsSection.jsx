import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Fitness Enthusiast',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    text: "Best shoe shopping experience ever! The collection is amazing and delivery was super fast. My Nike Air Max are absolutely perfect.",
  },
  {
    name: 'Priya Sharma',
    role: 'Marathon Runner',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 5,
    text: 'Found the perfect running shoes here. The filters make it so easy to find exactly what you need. Will definitely order again!',
  },
  {
    name: 'Rahul Kumar',
    role: 'Street Style',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 5,
    text: 'The sneaker collection is fire! Got my Jordan 4s at an amazing price. Authentic products and great customer service.',
  },
  {
    name: 'Ananya Patel',
    role: 'Fashion Blogger',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    rating: 5,
    text: "I've been recommending SoleStore to all my followers. The variety, quality, and prices are unbeatable. Love the Adidas Samba OGs!",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold mb-3">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-dark-500">Real stories from real sneakerheads</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote
                size={48}
                className="text-primary-200 mx-auto mb-6"
              />

              <p className="text-xl lg:text-2xl text-dark-700 leading-relaxed mb-8 font-medium italic">
                "{testimonials[current].text}"
              </p>

              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[current].rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow-400"
                      fill="currentColor"
                    />
                  )
                )}
              </div>

              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-14 h-14 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-display font-bold text-lg">
                {testimonials[current].name}
              </h4>
              <p className="text-sm text-dark-400">
                {testimonials[current].role}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full
                  ${i === current ? 'w-8 h-2 bg-primary-500' : 'w-2 h-2 bg-dark-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;