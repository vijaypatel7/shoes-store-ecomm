import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-dark-950 text-white hover:bg-dark-800 shadow-lg shadow-dark-950/10',
  secondary:
    'bg-white text-dark-950 border-2 border-dark-200 hover:border-dark-950 hover:bg-dark-950 hover:text-white',
  accent:
    'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25',
  ghost: 'bg-transparent text-dark-950 hover:bg-dark-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  icon,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-full font-semibold inline-flex items-center justify-center gap-2
        transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;