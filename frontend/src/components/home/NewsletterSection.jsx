import { motion } from 'framer-motion';
import { Send, Gift, Truck, RotateCcw, Shield } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Shield, title: '100% Authentic', desc: 'Verified products' },
  { icon: Gift, title: 'Gift Wrapping', desc: 'Available on all orders' },
];

const NewsletterSection = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <>
      {/* Features Bar */}
      <section className="py-12 bg-gray-50 border-y">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-dark-950 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-xs text-dark-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        ref={ref}
        className="py-16 lg:py-20 bg-gradient-to-br from-primary-500 to-primary-700"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-white/80 mb-8">
              Sign up for our newsletter and never miss out on exclusive drops,
              deals, and updates.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3.5 rounded-full text-dark-950 placeholder-dark-400
                  focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3.5 bg-dark-950 text-white rounded-full font-semibold
                  hover:bg-dark-800 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Subscribe
              </motion.button>
            </form>

            <p className="text-xs text-white/60 mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NewsletterSection;