import { useEffect } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryStrip from '../components/home/CategoryStrip';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandShowcase from '../components/home/BrandShowcase';
import TrendingSection from '../components/home/TrendingSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import NewsletterSection from '../components/home/NewsletterSection';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroCarousel />
      <CategoryStrip />
      <FeaturedProducts />
      <BrandShowcase />
      <TrendingSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;