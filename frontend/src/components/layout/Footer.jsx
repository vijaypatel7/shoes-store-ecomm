import { Link } from 'react-router-dom';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = {
    Shop: [
      { name: 'Men', path: '/shop?gender=Men' },
      { name: 'Women', path: '/shop?gender=Women' },
      { name: 'Kids', path: '/shop?gender=Kids' },
      { name: 'New Arrivals', path: '/shop?newArrival=true' },
      { name: 'Bestsellers', path: '/shop?bestseller=true' },
      { name: 'Sale', path: '/shop?sort=price_asc' },
    ],
    Brands: [
      { name: 'Nike', path: '/shop?brand=Nike' },
      { name: 'Adidas', path: '/shop?brand=Adidas' },
      { name: 'Puma', path: '/shop?brand=Puma' },
      { name: 'New Balance', path: '/shop?brand=New Balance' },
      { name: 'Jordan', path: '/shop?brand=Jordan' },
      { name: 'Converse', path: '/shop?brand=Converse' },
    ],
    Support: [
      { name: 'Contact Us', path: '#' },
      { name: 'FAQs', path: '#' },
      { name: 'Size Guide', path: '#' },
      { name: 'Shipping Info', path: '#' },
      { name: 'Returns', path: '#' },
      { name: 'Track Order', path: '/orders' },
    ],
    Company: [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Blog', path: '#' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
    ],
  };

  return (
    <footer className="bg-dark-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-display font-bold mb-2">
                Stay in the Loop
              </h3>
              <p className="text-dark-400">
                Subscribe to get special offers, free giveaways, and deals.
              </p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-6 py-3 bg-white/10 border border-white/20 rounded-l-full
                  text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
              />
              <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-r-full font-semibold transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-8 lg:mb-0">
            <h2 className="text-2xl font-display font-extrabold mb-4">
              SOLE<span className="text-primary-500">STORE</span>
            </h2>
            <p className="text-dark-400 text-sm mb-6 max-w-xs">
              Your ultimate destination for premium footwear. Step into style
              with 500+ curated shoe collections.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center
                    hover:bg-primary-500 transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-dark-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © 2024 SoleStore. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://img.icons8.com/color/48/visa.png"
              alt="Visa"
              className="h-6 opacity-50"
            />
            <img
              src="https://img.icons8.com/color/48/mastercard.png"
              alt="Mastercard"
              className="h-6 opacity-50"
            />
            <img
              src="https://img.icons8.com/color/48/google-pay-india.png"
              alt="GPay"
              className="h-6 opacity-50"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;