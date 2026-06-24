import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../../api/axios";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  bgColor,
  prefix = "",
}) => {
  const isPositive = change >= 0;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Use inline style so Tailwind doesn't purge dynamic class names */}
        <div
          className="p-3 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={20} className="text-white" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1
            rounded-full
            ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
        >
          {isPositive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {Math.abs(change ?? 0)}%
        </span>
      </div>
      <p className="text-2xl font-display font-bold text-dark-950">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
      </p>
      <p className="text-sm text-dark-400 mt-1">{title}</p>
    </motion.div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-600",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-50 text-blue-600",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-50 text-indigo-600",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-500",
    icon: XCircle,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold ${cfg.color}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
);

// ─── Empty Chart State ────────────────────────────────────────────────────────
const EmptyChart = ({ message = "No data available" }) => (
  <div className="h-56 flex flex-col items-center justify-center text-dark-300">
    <TrendingUp size={32} className="mb-2 opacity-30" />
    <p className="text-sm">{message}</p>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, ordersRes, revenueRes, stockRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/orders", {
            params: { limit: 6, sort: "newest" },
          }),
          API.get("/admin/revenue", {
            params: { period: "7days" },
          }),
          API.get("/admin/products/low-stock", {
            params: { limit: 5 },
          }),
        ]);

        setStats(statsRes.data.stats);
        setRecentOrders(ordersRes.data.orders || []);
        setRevenueData(revenueRes.data.chartData || []);
        setLowStockProducts(stockRes.data.products || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = stats
    ? [
        {
          title: "Total Revenue",
          // FIX: toFixed can crash if value is undefined — added safe fallback
          value:
            stats.totalRevenue != null ? stats.totalRevenue.toFixed(2) : "0.00",
          change: stats.revenueChange ?? 0,
          icon: DollarSign,
          // FIX: Use inline bgColor instead of dynamic Tailwind class
          bgColor: "#111827",
          prefix: "$",
        },
        {
          title: "Total Orders",
          value: stats.totalOrders ?? 0,
          change: stats.ordersChange ?? 0,
          icon: ShoppingBag,
          bgColor: "#6366f1",
        },
        {
          title: "Total Users",
          value: stats.totalUsers ?? 0,
          change: stats.usersChange ?? 0,
          icon: Users,
          bgColor: "#10b981",
        },
        {
          title: "Total Products",
          value: stats.totalProducts ?? 0,
          change: stats.productsChange ?? 0,
          icon: Package,
          bgColor: "#f59e0b",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-950">
            Dashboard
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <span
          className="text-xs text-dark-400 bg-gray-100 px-3 py-1.5
          rounded-full w-fit"
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-100
          rounded-2xl text-sm text-red-600"
        >
          <AlertTriangle size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))
          : statCards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      {/* ── Revenue Chart + Low Stock ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div
          className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm
          border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-dark-950">
                Revenue Overview
              </h2>
              <p className="text-xs text-dark-400 mt-0.5">Last 7 days</p>
            </div>
            <div
              className="flex items-center gap-1.5 text-emerald-500
              text-sm font-semibold"
            >
              <TrendingUp size={16} />
              {(stats?.revenueChange ?? 0) >= 0 ? "+" : ""}
              {stats?.revenueChange ?? 0}%
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : revenueData.length === 0 ? (
            // FIX: Added empty state for chart
            <EmptyChart message="No revenue data for this period" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  // FIX: Safe check before calling toFixed
                  formatter={(v) => [
                    `$${typeof v === "number" ? v.toFixed(2) : v}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111827"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={{ fill: "#111827", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="font-display font-bold text-dark-950">
              Low Stock Alert
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle
                size={32}
                className="mx-auto mb-2 text-emerald-400"
              />
              <p className="text-sm text-dark-400">
                All products are well stocked 🎉
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-2.5 rounded-xl
                    hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={
                      product.image || product.images?.[0] || "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover
                      bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-dark-400">{product.brand}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full
                      flex-shrink-0 whitespace-nowrap
                      ${
                        product.stock <= 3
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                      }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))}
              <Link
                to="/admin/products"
                className="block text-center text-xs text-primary-500
                  font-medium hover:underline mt-3 pt-2 border-t border-gray-50"
              >
                Manage Inventory →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100
        overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-6 py-5
          border-b border-gray-100"
        >
          <h2 className="font-display font-bold text-dark-950">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs text-primary-500 font-semibold
              hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {[
                    "Order ID",
                    "Customer",
                    "Date",
                    "Items",
                    "Total",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-xs font-semibold
                        text-dark-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-dark-400 text-sm"
                    >
                      <ShoppingBag
                        size={32}
                        className="mx-auto mb-2 opacity-20"
                      />
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-dark-500">
                        #{order._id?.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-dark-900">
                            {order.user?.name || "Guest"}
                          </p>
                          <p className="text-xs text-dark-400">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dark-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-dark-500">
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 font-semibold text-dark-950">
                        {/* FIX: Support both totalAmount and totalPrice */}$
                        {(order.totalAmount ?? order.totalPrice ?? 0).toFixed(
                          2,
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
