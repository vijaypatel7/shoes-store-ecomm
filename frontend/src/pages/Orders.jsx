import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <motion.div layout className="bg-white rounded-2xl border overflow-hidden">
      {/* Order Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50
          transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Package size={18} className="text-dark-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-dark-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </p>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-xs text-dark-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-base font-bold text-dark-900 hidden sm:block">
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </p>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Order Items (Expanded) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Items */}
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0
                      cursor-pointer"
                    onClick={() => navigate(`/product/${item.product?._id}`)}
                  >
                    {item.product?.images?.[0] || '' ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-dark-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold text-dark-900 truncate cursor-pointer
                        hover:text-primary-500 transition-colors"
                      onClick={() => navigate(`/product/${item.product?._id}`)}
                    >
                      {item.product?.name || "Product Unavailable"}
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
                  <p className="text-sm font-semibold text-dark-900 flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t pt-4 space-y-2">
                {/* Price Breakdown */}
                <div className="flex justify-between text-sm text-dark-500">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString("en-IN") || "—"}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount?.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-dark-500">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCost === 0
                      ? "Free"
                      : `₹${order.shippingCost?.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-dark-900 pt-1 border-t">
                  <span>Total</span>
                  <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-dark-700 mb-1 uppercase tracking-wide">
                    Shipping Address
                  </p>
                  <p className="text-sm text-dark-500">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    , {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              )}

              {/* Payment Info */}
              <div className="flex items-center justify-between text-xs text-dark-400">
                <span>
                  Payment:{" "}
                  {order.paymentMethod === "razorpay"
                    ? "Online"
                    : "Cash on Delivery"}
                </span>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data.orders || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-display font-bold">
                My Orders
              </h1>
              <p className="text-sm text-dark-400 mt-0.5">
                {orders.length} order{orders.length !== 1 ? "s" : ""} placed
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {[
              "all",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                    transition-colors capitalize
                    ${
                      filter === f
                        ? "bg-dark-950 text-white"
                        : "bg-gray-100 text-dark-500 hover:bg-gray-200"
                    }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-24 h-24 bg-gray-100 rounded-full flex items-center
                justify-center mb-6"
              >
                <ShoppingBag size={40} className="text-dark-300" />
              </div>
              <h2 className="text-xl font-display font-bold text-dark-900 mb-2">
                No orders yet
              </h2>
              <p className="text-dark-400 text-sm mb-8 max-w-xs">
                {filter === "all"
                  ? "You haven't placed any orders yet. Start shopping!"
                  : `No ${filter} orders found.`}
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-8 py-3 bg-dark-950 text-white rounded-full font-medium
                  hover:bg-dark-800 transition-colors"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
