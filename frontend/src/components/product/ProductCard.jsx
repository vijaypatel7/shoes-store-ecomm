import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(product._id);
  const navigate = useNavigate();
  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const availableSize = product.sizes?.find((s) => s.stock > 0);

    if (availableSize) {
      addToCart(
        product._id,
        availableSize.size,
        product.colors?.[0] || null,
        1,
      );
    }
  };
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save items");
      navigate("/login");
      return;
    }
    try {
      if (liked) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error(error);
    }
  };

  const handleViewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
          {!imageLoaded && <div className="absolute inset-0 shimmer" />}
          <motion.img
            src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700
              group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Image */}
          {product.images?.[1] && (
            <motion.img
              src={product.images[1].url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount > 0 && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
              >
                -{product.discount}%
              </motion.span>
            )}

            {product.isNewArrival && (
              <span className="bg-dark-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                NEW
              </span>
            )}

            {product.isBestseller && (
              <span className="bg-primary-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                BEST
              </span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
    transition-all duration-300 ${
      liked
        ? "bg-red-500 text-white"
        : "bg-white/80 backdrop-blur text-dark-600 opacity-0 group-hover:opacity-100"
    }`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </motion.button>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 20,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-dark-950 text-white text-xs font-semibold py-2.5 rounded-full
                hover:bg-dark-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>

            {/* Fixed: button instead of nested Link */}
            <button
              onClick={handleViewProduct}
              className="w-10 h-10 bg-white text-dark-950 rounded-full flex items-center justify-center
                hover:bg-gray-100 transition-colors"
            >
              <Eye size={16} />
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 px-1">
          <p className="text-[11px] font-semibold text-dark-400 uppercase tracking-wider">
            {product.brand}
          </p>

          <h3 className="font-medium text-sm text-dark-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" fill="currentColor" />
              <span className="text-xs font-medium text-dark-600">
                {product.rating.average}
              </span>
              <span className="text-xs text-dark-400">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Colors */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{
                    backgroundColor:
                      typeof color === "object" ? color.hex : "#d1d5db",
                  }}
                  title={typeof color === "object" ? color.name : color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-dark-400">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-base font-bold text-dark-950">
              ₹{product.price?.toLocaleString()}
            </span>

            {product.originalPrice > product.price && (
              <span className="text-sm text-dark-400 line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;