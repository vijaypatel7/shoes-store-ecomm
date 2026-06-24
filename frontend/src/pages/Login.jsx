import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Invalid email or password. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role = 'user') => {
    const credentials =
      role === 'admin'
        ? { email: 'admin@demo.com', password: 'admin123' }
        : { email: 'user@demo.com', password: 'user123' };

    setForm(credentials);
    setLoading(true);
    setServerError('');
    try {
      await login(credentials.email, credentials.password);
      toast.success(
        role === 'admin'
          ? 'Logged in as Demo Admin 🔑'
          : 'Logged in as Demo User 👟'
      );
      navigate(role === 'admin' ? '/admin' : from, { replace: true });
    } catch {
      setServerError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white
      to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link
            to="/"
            className="inline-block text-3xl font-display font-black text-dark-950
              tracking-tight"
          >
            SOLE<span className="text-primary-500">STORE</span>
          </Link>
          <p className="text-dark-400 text-sm mt-2">
            Your premium sneaker destination
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          {/* Card Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-display font-bold text-dark-950">
              Welcome back
            </h1>
            <p className="text-dark-400 text-sm mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {/* Server Error Banner */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5 bg-red-50 border border-red-200
                  text-red-600 rounded-xl px-4 py-3 mb-5 text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Redirect Message */}
          {location.state?.from && (
            <div className="flex items-center gap-2 bg-amber-50 border
              border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              Please sign in to access that page
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-dark-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                    focus:outline-none focus:ring-2 transition-all
                    ${errors.email
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-dark-950/10 focus:border-dark-400'
                    }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle size={11} />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-dark-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-500 hover:text-primary-600
                    font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm
                    focus:outline-none focus:ring-2 transition-all
                    ${errors.password
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-dark-950/10 focus:border-dark-400'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                    text-dark-400 hover:text-dark-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle size={11} />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5
                bg-dark-950 text-white rounded-xl font-semibold text-sm
                hover:bg-dark-800 transition-colors duration-200
                disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-dark-500 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-dark-950 font-semibold hover:text-primary-500
                transition-colors"
            >
              Register
            </Link>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-dark-400 mt-6"
        >
          By signing in, you agree to our{' '}
          <Link
            to="/terms"
            className="underline hover:text-dark-700 transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="underline hover:text-dark-700 transition-colors"
          >
            Privacy Policy
          </Link>
        </motion.p>
      </div>
    </div>
  );
};

export default Login;