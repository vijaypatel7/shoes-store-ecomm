import { Toaster } from 'react-hot-toast';

const ToastProvider = () => (
  <Toaster
    position="bottom-center"
    toastOptions={{
      duration: 3000,
      style: {
        background: '#1a1a1a',
        color: '#fff',
        borderRadius: '50px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '500',
      },
      success: {
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      },
    }}
  />
);

export default ToastProvider;