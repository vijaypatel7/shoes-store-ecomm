import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import CartDrawer from '../cart/CartDrawer';
import ToastProvider from '../ui/Toast';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastProvider />
      <Navbar />

      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
      <CartDrawer />
    </div>
  );
};

export default Layout;