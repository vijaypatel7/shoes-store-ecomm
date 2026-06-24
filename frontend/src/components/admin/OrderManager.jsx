import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  ChevronDown,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
} from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    icon: Clock,
    next: "processing",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-50 text-green-600 border-green-200",
    icon: CheckCircle,
    next: "processing",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: Package,
    next: "shipped",
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    icon: Truck,
    next: "delivered",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
    next: null,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-500 border-red-200",
    icon: XCircle,
    next: null,
  },
};

// ─── Components ───────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
);

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold border ${cfg.color}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return;
    setUpdating(true);
    try {
      await API.put(`/admin/orders/${order._id}/status`, { status: newStatus });
      onStatusUpdate(order._id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      onClose();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex
          items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh]
            overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="font-display font-bold text-dark-950">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h2>
              <p className="text-xs text-dark-400 mt-0.5">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p
                  className="text-xs font-semibold text-dark-400 uppercase
                  tracking-wider mb-2"
                >
                  Customer
                </p>
                <p className="font-semibold text-dark-900 text-sm">
                  {order.user?.name || "Guest"}
                </p>
                <p className="text-xs text-dark-500 mt-0.5">
                  {order.user?.email}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p
                  className="text-xs font-semibold text-dark-400 uppercase
                  tracking-wider mb-2"
                >
                  Shipping Address
                </p>
                {order.shippingAddress ? (
                  <div className="text-xs text-dark-700 space-y-0.5">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-xs text-dark-400">No address provided</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p
                className="text-xs font-semibold text-dark-400 uppercase
                tracking-wider mb-3"
              >
                Order Items ({order.items?.length || 0})
              </p>
              <div className="space-y-2.5">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={
                        item.product?.image ||
                        item.product?.images?.[0]?.url ||
                        "/placeholder.png"
                      }
                      alt={item.product?.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-200
                        flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 truncate">
                        {item.product?.name || "Product"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-dark-400 mt-0.5">
                        <span>Size: {item.size}</span>

                        {item.color?.name && (
                          <>
                            <span>·</span>

                            <div className="flex items-center gap-1">
                              <span>Color:</span>

                              <span
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: item.color.hex }}
                              />

                              <span>{item.color.name}</span>
                            </div>
                          </>
                        )}

                        <span>· Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-dark-950 flex-shrink-0">
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
                Price Summary
              </p>

              <div className="flex justify-between text-base font-bold text-dark-950">
                <span>Total Amount</span>
                <span>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-3 text-sm text-dark-500">
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className="capitalize">
                    {order.paymentStatus || "pending"}
                  </span>
                </div>

                <div className="flex justify-between mt-1">
                  <span>Payment Method</span>
                  <span className="uppercase">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            {/* Status Update */}
            <div>
              <p
                className="text-xs font-semibold text-dark-400 uppercase
                tracking-wider mb-3"
              >
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([status, cfg]) => (
                  <button
                    key={status}
                    onClick={() => setNewStatus(status)}
                    disabled={
                      status === "delivered" &&
                      order.status !== "shipped" &&
                      newStatus !== "shipped"
                    }
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs
                      font-semibold border transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed
                      ${
                        newStatus === status
                          ? cfg.color + " shadow-sm scale-105"
                          : "border-gray-200 text-dark-500 hover:border-gray-400"
                      }`}
                  >
                    <cfg.icon size={12} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border text-sm font-medium
                text-dark-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === order.status}
              className="px-5 py-2 bg-dark-950 text-white rounded-xl text-sm
                font-semibold hover:bg-dark-800 disabled:opacity-50
                disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {updating && <RefreshCw size={14} className="animate-spin" />}
              Update Status
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main OrderManager ────────────────────────────────────────────────────────
const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/orders", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          status: statusFilter || undefined,
          sort,
        },
      });
      setOrders(data.orders || []);
      setPagination(data.pagination || {});
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sort]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sort]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  const handleExport = async () => {
    try {
      const response = await API.get("/admin/orders/export", {
        params: {
          status: statusFilter || undefined,
          search: search || undefined,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Orders exported successfully");
    } catch {
      toast.error("Export failed");
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-950">
            Order Manager
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            {pagination.total || 0} total orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 border rounded-xl hover:bg-gray-50 transition-colors
              text-dark-400"
            aria-label="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-950 text-white
              rounded-xl text-sm font-medium hover:bg-dark-800 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
            />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200
                text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                focus:border-dark-400 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div
            className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl
            flex-shrink-0"
          >
            <Filter size={14} className="text-dark-400 ml-1.5" />
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-200 whitespace-nowrap
                  ${
                    statusFilter === opt.value
                      ? "bg-white text-dark-950 shadow-sm"
                      : "text-dark-400 hover:text-dark-700"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0" data-sort>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-xl
                text-sm font-medium hover:border-dark-300 transition-colors
                bg-white whitespace-nowrap"
            >
              {sort === "newest" ? "Newest First" : "Oldest First"}
              <ChevronDown
                size={14}
                className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl
                    shadow-xl border py-1.5 z-20"
                >
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors
                        hover:bg-gray-50
                        ${
                          sort === opt.value
                            ? "font-semibold text-dark-950"
                            : "text-dark-600"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden"
      >
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Order ID",
                    "Customer",
                    "Date",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold
                        text-dark-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-14 text-dark-400 text-sm"
                    >
                      <Package size={32} className="mx-auto mb-3 opacity-30" />
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td
                        className="px-5 py-4 font-mono text-xs text-dark-500
                        whitespace-nowrap"
                      >
                        #{order._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-dark-900 whitespace-nowrap">
                            {order.user?.name || "Guest"}
                          </p>
                          <p className="text-xs text-dark-400 truncate max-w-[160px]">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-dark-500 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-dark-500 text-center">
                        {order.items?.length || 0}
                      </td>
                      <td
                        className="px-5 py-4 font-semibold text-dark-950
                        whitespace-nowrap"
                      >
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5
                            bg-dark-950 text-white rounded-lg text-xs font-medium
                            hover:bg-dark-800 transition-colors"
                        >
                          <Eye size={12} />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            className="flex items-center justify-between px-6 py-4 border-t
            border-gray-100"
          >
            <p className="text-xs text-dark-400">
              Page {page} of {totalPages} ·{" "}
              <span className="font-medium">{pagination.total}</span> orders
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border disabled:opacity-40
                  disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold
                      transition-colors
                      ${
                        page === pageNum
                          ? "bg-dark-950 text-white"
                          : "border hover:bg-gray-50 text-dark-600"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border disabled:opacity-40
                  disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManager;
