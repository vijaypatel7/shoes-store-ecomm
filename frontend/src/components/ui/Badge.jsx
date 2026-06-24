const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const styles = {
    default: 'bg-dark-100 text-dark-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    accent: 'bg-primary-500 text-white',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
        ${styles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;