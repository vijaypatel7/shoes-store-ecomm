import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  MapPin,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: user?.address?.country || 'India',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', {
        ...profileData,
        address,
      });
      setUser(data.user);
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await API.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'password', label: 'Password', icon: Lock },
  ];

  const inputClass =
    'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/20 focus:border-dark-950 transition-all';

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="container-custom py-4">
          <h1 className="text-xl lg:text-2xl font-display font-bold">My Profile</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          {/* Alert Message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm
                ${message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
                }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message.text}
            </motion.div>
          )}

          <div className="bg-white rounded-2xl border overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-dark-950 to-dark-800 p-8 text-white">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center
                    justify-center text-2xl font-bold border-2 border-white/30">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500
                    rounded-full flex items-center justify-center hover:bg-primary-600
                    transition-colors">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-white/70 text-sm">{user?.email}</p>
                  {user?.role === 'admin' && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500
                      text-white text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y-0">
              <button
                onClick={() => navigate('/orders')}
                className="p-4 text-center hover:bg-gray-50 transition-colors"
              >
                <Package size={20} className="mx-auto mb-1 text-dark-400" />
                <p className="text-sm font-semibold text-dark-900">Orders</p>
                <p className="text-xs text-dark-400">View all</p>
              </button>
              <div className="p-4 text-center">
                <span className="text-2xl font-bold text-dark-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : '—'}
                </span>
                <p className="text-xs text-dark-400 mt-1">Member Since</p>
              </div>
              <div className="p-4 text-center">
                <span className="text-2xl">👟</span>
                <p className="text-xs text-dark-400 mt-1">Shoe Lover</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-t">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm
                    font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === id
                      ? 'border-dark-950 text-dark-900'
                      : 'border-transparent text-dark-400 hover:text-dark-700'
                    }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleProfileUpdate}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
                      />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((p) => ({ ...p, name: e.target.value }))
                        }
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
                      />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((p) => ({ ...p, email: e.target.value }))
                        }
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
                      />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((p) => ({ ...p, phone: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-dark-950 text-white
                      rounded-xl text-sm font-medium hover:bg-dark-800 transition-colors
                      disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                </motion.form>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleProfileUpdate}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        setAddress((p) => ({ ...p, street: e.target.value }))
                      }
                      placeholder="123, Main Street, Apartment 4B"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                        focus:outline-none focus:ring-2 focus:ring-dark-950/20
                        focus:border-dark-950 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, city: e.target.value }))
                        }
                        placeholder="Mumbai"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                          focus:outline-none focus:ring-2 focus:ring-dark-950/20
                          focus:border-dark-950 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, state: e.target.value }))
                        }
                        placeholder="Maharashtra"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                          focus:outline-none focus:ring-2 focus:ring-dark-950/20
                          focus:border-dark-950 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, pincode: e.target.value }))
                        }
                        placeholder="400001"
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                          focus:outline-none focus:ring-2 focus:ring-dark-950/20
                          focus:border-dark-950 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, country: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                          focus:outline-none focus:ring-2 focus:ring-dark-950/20
                          focus:border-dark-950 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-dark-950 text-white
                      rounded-xl text-sm font-medium hover:bg-dark-800 transition-colors
                      disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Address
                  </button>
                </motion.form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handlePasswordUpdate}
                  className="space-y-4 max-w-sm"
                >
                  {['currentPassword', 'newPassword', 'confirmPassword'].map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-dark-700 mb-1.5 capitalize">
                          {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <div className="relative">
                          <Lock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
                          />
                          <input
                            type="password"
                            value={passwordData[field]}
                            onChange={(e) =>
                              setPasswordData((p) => ({
                                ...p,
                                [field]: e.target.value,
                              }))
                            }
                            placeholder="••••••••"
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>
                    )
                  )}

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-dark-950 text-white
                      rounded-xl text-sm font-medium hover:bg-dark-800 transition-colors
                      disabled:opacity-60"
                  >
                    {passwordLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Lock size={16} />
                    )}
                    Change Password
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;