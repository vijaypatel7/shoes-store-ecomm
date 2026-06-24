import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Tag, ChevronRight, Lock, X, } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const FREE_SHIPPING_THRESHOLD = 999;

const CartSummary = ({ showCheckout = true }) => {
  const { cartItems = [], cartTotal = 0 } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const discountAmount = Math.round((cartTotal * discount) / 100);
  const finalTotal = cartTotal - discountAmount + shippingCost;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError("");
    try {
      const { data } = await API.post("/orders/apply-promo", {
        code: promoCode,
      });
      setDiscount(data.discount || 10);
      setPromoApplied(true);
    } catch {
      setPromoError("Invalid or expired promo code.");
    }
  };

  const handleRemovePromo = () => {
  setPromoApplied(false);
  setDiscount(0);
  setPromoCode('');
  setPromoError('');
};

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const orderRes = await API.post("/orders", {
      promoCode: promoApplied ? promoCode : undefined,
    });
        const orderId = orderRes.data.order._id;
    const paymentRes = await API.post("/payment/create-order", {
      orderId,
    });
    const { razorpayOrder, key } = paymentRes.data;

      // Razorpay Integration
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "SoleStore",
        description: "Purchase from SoleStore",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate("/orders");
          } catch {
                      console.error(error);

            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

        theme: { color: "#0a0a0a" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.error(response.error);
      alert("Payment failed");
      setLoading(false);
    });

    razorpay.open();
  } catch (error) {
    console.error(error);
    alert(
      error?.response?.data?.message ||
      "Failed to initiate payment"
    );
  } finally {
    setLoading(false);
  }
};

  if (cartItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border p-6 space-y-5 sticky top-32"
    >
      <h2 className="text-lg font-display font-bold text-dark-900">
        Order Summary
      </h2>

      {/* Items Summary */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          
          <div
            key={`${item.product._id}-${item.size}`}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              
              {item.product.images?.[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={16} className="text-dark-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-dark-900 truncate">
                {item.product.name}
              </p>
              <p className="text-[11px] text-dark-400">
                Size {item.size} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-xs font-semibold text-dark-900 flex-shrink-0">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4" />

      {/* Promo Code */}
      {!promoApplied ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-dark-400" />
            <span className="text-sm font-medium text-dark-700">
              Promo Code
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                setPromoError("");
              }}
              placeholder="SAVE10"
              className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none
                focus:ring-2 focus:ring-dark-950/20 focus:border-dark-950 transition-all"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-dark-950 text-white rounded-xl text-sm
                font-medium hover:bg-dark-800 transition-colors"
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p className="text-xs text-red-500 mt-1">{promoError}</p>
          )}
        </div>
      ) : (
<div
  className="flex items-center justify-between bg-green-50 border
  border-green-200 rounded-xl px-3 py-2"
>
  <div className="flex items-center gap-2 text-green-700">
    <Tag size={14} />
    <span className="text-sm font-medium">
      {promoCode} applied
    </span>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-sm font-bold text-green-700">
      -{discount}%
    </span>

    <button
      onClick={handleRemovePromo}
      className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
      title="Remove coupon"
    >
      <X size={14} />
    </button>
  </div>
</div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-dark-500">
          <span>
            Subtotal ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            )
          </span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Promo Discount</span>
            <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-dark-500">
          <div className="flex items-center gap-1.5">
            <Truck size={14} />
            <span>Shipping</span>
          </div>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `₹${shippingCost}`
            )}
          </span>
        </div>

        {shippingCost > 0 && (
          <p className="text-xs text-dark-400">
            Add ₹{(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString("en-IN")}{" "}
            more for free shipping
          </p>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between text-base font-bold text-dark-900">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-dark-400 mt-0.5">Inclusive of all taxes</p>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckout && (
        <button
          onClick={handleCheckout}
          disabled={loading || cartItems.length === 0}
          className="w-full py-3.5 bg-dark-950 text-white rounded-xl font-semibold
            flex items-center justify-center gap-2 hover:bg-dark-800 transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div
              className="w-5 h-5 border-2 border-white border-t-transparent
              rounded-full animate-spin"
            />
          ) : (
            <>
              <Lock size={16} />
              Proceed to Checkout
              <ChevronRight size={16} />
            </>
          )}
        </button>
      )}

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-1 text-xs text-dark-400">
        <Lock size={12} />
        <span>Secured by Razorpay · SSL Encrypted</span>
      </div>
    </motion.div>
  );
};

export default CartSummary;
