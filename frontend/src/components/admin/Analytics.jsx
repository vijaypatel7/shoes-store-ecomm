import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Package,
} from "lucide-react";
import API from "../../api/axios";

// ─── Constants ────────────────────────────────────────────────────────────────
const PERIODS = [
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
  { label: "3 Months", value: "3months" },
  { label: "1 Year", value: "1year" },
];

const PIE_COLORS = [
  "#111827",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
);

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({
  title,
  value,
  change,
  icon: Icon,
  bgColor,
  prefix = "",
}) => {
  const isPositive = (change ?? 0) >= 0;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-3">
        {/* FIX: use bgColor inline style — Tailwind can't resolve dynamic class names */}
        <div
          className="p-2.5 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={18} className="text-white" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2
            py-0.5 rounded-full
            ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
        >
          {isPositive ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}
          {Math.abs(change ?? 0)}%
        </span>
      </div>
      <p className="text-xl font-display font-bold text-dark-950 mt-3">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
      </p>
      <p className="text-xs text-dark-400 mt-0.5">{title}</p>
    </motion.div>
  );
};

// ─── Chart Card Wrapper ───────────────────────────────────────────────────────
// FIX: removed unused className prop from original — now it actually applies it
const ChartCard = ({ title, subtitle, children, loading, className = "" }) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100
      ${className}`}
  >
    <div className="mb-5">
      <h3 className="font-display font-bold text-dark-950">{title}</h3>
      {subtitle && <p className="text-xs text-dark-400 mt-0.5">{subtitle}</p>}
    </div>
    {loading ? <Skeleton className="h-60 w-full" /> : children}
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white rounded-xl shadow-xl border border-gray-100
      p-3 text-xs"
    >
      <p className="font-semibold text-dark-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}:{" "}
          <span className="text-dark-900">
            {p.name.toLowerCase().includes("revenue") ||
            p.name.toLowerCase().includes("price")
              ? `${prefix}${Number(p.value ?? 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : Number(p.value ?? 0).toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ message = "No data available for this period" }) => (
  <div
    className="h-48 flex flex-col items-center justify-center
    text-dark-300"
  >
    <Package size={32} className="mb-2 opacity-30" />
    <p className="text-sm">{message}</p>
  </div>
);

// ─── Main Analytics Component ─────────────────────────────────────────────────
const Analytics = () => {
  const [period, setPeriod] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, chartsRes] = await Promise.all([
          API.get("/admin/analytics/summary", { params: { period } }),
          API.get("/admin/analytics/charts", { params: { period } }),
        ]);

        setSummary(summaryRes.data);
        setRevenueData(chartsRes.data.revenue || []);
        setOrdersData(chartsRes.data.orders || []);
        setCategoryData(chartsRes.data.categories || []);
        setTopProducts(chartsRes.data.topProducts || []);
        setUserGrowth(chartsRes.data.userGrowth || []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  const summaryCards = summary
    ? [
        {
          title: "Total Revenue",
          // FIX: safe null check before toFixed
          value:
            summary.totalRevenue != null
              ? summary.totalRevenue.toFixed(2)
              : "0.00",
          change: summary.revenueChange ?? 0,
          icon: DollarSign,
          bgColor: "#111827",
          prefix: "₹",
        },
        {
          title: "Total Orders",
          value: summary.totalOrders ?? 0,
          change: summary.ordersChange ?? 0,
          icon: ShoppingBag,
          bgColor: "#6366f1",
        },
        {
          title: "New Users",
          value: summary.newUsers ?? 0,
          change: summary.usersChange ?? 0,
          icon: Users,
          bgColor: "#10b981",
        },
        {
          title: "Avg. Order Value",
          value:
            summary.avgOrderValue != null
              ? summary.avgOrderValue.toFixed(2)
              : "0.00",
          change: summary.avgOrderChange ?? 0,
          icon: TrendingUp,
          bgColor: "#f59e0b",
          prefix: "₹",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-950">
            Analytics
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            Track your store performance
          </p>
        </div>

        {/* Period Selector */}
        {/* FIX: Calendar icon was unaligned — moved it inside a flex row correctly */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
          <div className="flex items-center pl-2 pr-1">
            <Calendar size={14} className="text-dark-400" />
          </div>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                transition-all duration-200
                ${
                  period === p.value
                    ? "bg-white text-dark-950 shadow-sm"
                    : "text-dark-400 hover:text-dark-700"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="p-4 bg-red-50 border border-red-100 rounded-2xl
          text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          : summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
      </div>

      {/* ── Revenue + Orders Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Trend"
          subtitle={`Revenue over the last ${
            PERIODS.find((p) => p.value === period)?.label
          }`}
          loading={loading}
        >
          {revenueData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#111827"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#111827" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Orders Overview"
          subtitle="Orders placed per day"
          loading={loading}
        >
          {ordersData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={ordersData}
                barSize={28}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip prefix="" />}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Category Breakdown + User Growth ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Category Pie Chart */}
        <ChartCard
          title="Sales by Category"
          subtitle="Revenue distribution"
          loading={loading}
        >
          {categoryData.length === 0 ? (
            <EmptyState message="No category data available" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    // FIX: safe check — v could be undefined
                    formatter={(v, n) => [
                      `₹${typeof v === "number" ? v.toFixed(2) : "0.00"}`,
                      n,
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
                {categoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span className="text-xs text-dark-600">{cat.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>

        {/* User Growth — spans 2 columns on xl */}
        {/* FIX: removed the redundant inner <div className="xl:col-span-2">
            that was wrapping content inside ChartCard — it was causing layout
            issues since ChartCard already renders its own wrapper div */}
        <ChartCard
          title="User Growth"
          subtitle="New registrations over time"
          loading={loading}
          className="xl:col-span-2"
        >
          {userGrowth.length === 0 ? (
            <EmptyState message="No user growth data available" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={userGrowth}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip prefix="" />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalUsers"
                  name="Total Users"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Top Products Table ── */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100
        overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-display font-bold text-dark-950">Top Products</h3>
          <p className="text-xs text-dark-400 mt-0.5">
            Best performing products by revenue
          </p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "#",
                    "Product",
                    "Category",
                    "Units Sold",
                    "Revenue",
                    "Growth",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold
                        text-dark-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-dark-400 text-sm"
                    >
                      No data available for this period
                    </td>
                  </tr>
                ) : (
                  topProducts.map((product, idx) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 text-dark-400 font-medium text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.image ||
                              product.images?.[0] ||
                              "/placeholder.png"
                            }
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover
                              bg-gray-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <div>
                            <p className="font-medium text-dark-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-dark-400">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 bg-gray-100 text-dark-600
                          rounded-full text-xs font-medium"
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-dark-700">
                        {product.unitsSold?.toLocaleString() ?? "0"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-dark-950">
                        {/* FIX: safe check before toFixed */}₹
                        {typeof product.revenue === "number"
                          ? product.revenue.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-1 text-xs
                            font-semibold w-fit
                            ${
                              (product.growth ?? 0) >= 0
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                        >
                          {(product.growth ?? 0) >= 0 ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {Math.abs(product.growth ?? 0)}%
                        </span>
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

export default Analytics;
