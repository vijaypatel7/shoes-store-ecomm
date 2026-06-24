import { createContext, useContext, useEffect, useState } from "react";

import API from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistAnimationKey, setWishlistAnimationKey] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/users/wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToWishlist = async (productId) => {
    await API.post(`/users/wishlist/${productId}`);

    setWishlistAnimationKey((prev) => prev + 1);

    fetchWishlist();
  };

  const removeFromWishlist = async (productId) => {
    await API.delete(`/users/wishlist/${productId}`);
    fetchWishlist();
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId || item === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        wishlistAnimationKey,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
