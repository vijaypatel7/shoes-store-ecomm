import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
const [cart, setCart] = useState(null);
const [cartLoading, setCartLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
      return;
    }
    try {
      const { data } = await API.get("/cart");
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to fetch cart");
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return false;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/cart/add", {
        productId,
        size,
        color,
        quantity,
      });
      setCart(data.cart);
      setCartOpen(true);
      toast.success("Added to cart!", {
        icon: "🛒",
        style: {
          borderRadius: "50px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await API.put(`/cart/item/${itemId}`, { quantity });
      setCart(data.cart);
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/item/${itemId}`);
      setCart(data.cart);
      toast.success("Item removed", {
        style: {
          borderRadius: "50px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await API.delete("/cart/clear");
      setCart(data.cart);
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };
  const cartItems = cart?.items || [];
  const cartCount = cart?.totalItems || 0;
  const cartTotal = cart?.totalAmount || 0;
  console.log("CART CONTEXT:", cart);
  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
