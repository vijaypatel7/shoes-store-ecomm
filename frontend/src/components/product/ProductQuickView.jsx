import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Share2,
  Check,
  Minus,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductQuickView = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product?._id);

  // Derive available colors from variants
  const availableColors = product?.variants
    ? [...new Map(product.variants.map((v) => [v.color, v])).values()]
    : [];

  // Derive sizes for selected color
  const availableSizes = product?.variants
    ? product.variants
        .filter((v) => (selectedColor ? v.color === selectedColor : true))
        .map((v) => ({ size: v.size, stock: v.stock }))
    : product?.sizes?.map((s) => ({ size: s, stock: 10 })) || [];

  // Set default color on mount
  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0].color);
    }
  }, [product]);

  // Reset size when color changes
  useEffect(() => {
    setSelectedSize(null);
  }, [selectedColor]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentImageIndex]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const images =
    product.images?.length > 0
      ? product.images.map((img) => img.url)
      : ["/placeholder.jpg"];

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsImageLoading(true);
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsImageLoading(true);
  }, [images.length]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      onClose();
      navigate("/login");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      await addToCart(product._id, selectedSize, selectedColor, 1);
      setAddedToCart(true);
      toast.success(`${product.name} added to cart!`);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to save items");
      onClose();
      navigate("/login");
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.slug || product._id}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "dec") return Math.max(1, prev - 1);
      if (type === "inc") return Math.min(10, prev + 1);
      return prev;
    });
  };

  const discountedPrice =
    product?.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : null;

  const selectedVariantStock = product?.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  )?.stock;

  const isOutOfStock =
    selectedSize && selectedVariantStock !== undefined
      ? selectedVariantStock === 0
      : false;

  if (!product) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        aria-modal="true"
        role="dialog"
        aria-label={`Quick view: ${product.name}`}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh]
            overflow-hidden flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm
              rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Close quick view"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* ─── Left: Image Gallery ─── */}
            <div className="relative md:w-1/2 bg-gray-50 flex-shrink-0">
              {/* Main Image */}
              <div
                className={`relative overflow-hidden aspect-square cursor-zoom-in
                  ${imageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => setImageZoomed((z) => !z)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`${product.name} - view ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: isImageLoading ? 0 : 1,
                      x: 0,
                      scale: imageZoomed ? 1.5 : 1,
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onLoad={() => setIsImageLoading(false)}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </AnimatePresence>

                {/* Loading Skeleton */}
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}

                {/* Zoom Hint */}
                {!imageZoomed && (
                  <div
                    className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm
                    rounded-full p-1.5 shadow text-dark-400"
                  >
                    <ZoomIn size={14} />
                  </div>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div
                    className="absolute top-3 left-3 bg-primary-500 text-white
                    text-xs font-bold px-2.5 py-1 rounded-full shadow"
                  >
                    -{product.discount}%
                  </div>
                )}

                {/* New Badge */}
                {product.isNew && !product.discount && (
                  <div
                    className="absolute top-3 left-3 bg-emerald-500 text-white
                    text-xs font-bold px-2.5 py-1 rounded-full shadow"
                  >
                    NEW
                  </div>
                )}
              </div>

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2
                      bg-white/90 backdrop-blur-sm rounded-full shadow-md
                      hover:bg-white transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                      bg-white/90 backdrop-blur-sm rounded-full shadow-md
                      hover:bg-white transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div
                  className="flex gap-2 p-3 bg-white border-t overflow-x-auto
                  scrollbar-hide justify-center"
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setIsImageLoading(true);
                      }}
                      className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0
                        border-2 transition-all duration-200
                        ${
                          currentImageIndex === idx
                            ? "border-dark-950 scale-105"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Dot Indicators (mobile) */}
              {images.length > 1 && (
                <div className="flex gap-1.5 justify-center pb-2 md:hidden">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`rounded-full transition-all duration-200
                        ${
                          currentImageIndex === idx
                            ? "w-4 h-2 bg-dark-950"
                            : "w-2 h-2 bg-gray-300"
                        }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ─── Right: Product Details ─── */}
            <div className="md:w-1/2 flex flex-col overflow-y-auto">
              <div className="p-6 flex flex-col gap-4 flex-1">
                {/* Brand & Actions Row */}
                <div className="flex items-start justify-between">
                  <div>
                    {product.brand && (
                      <p
                        className="text-xs font-semibold text-primary-500
                        uppercase tracking-widest mb-1"
                      >
                        {product.brand}
                      </p>
                    )}
                    <h2
                      className="text-xl lg:text-2xl font-display font-bold
                      text-dark-950 leading-tight"
                    >
                      {product.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 rounded-full border transition-all duration-200
                        ${
                          isWishlisted
                            ? "bg-red-50 border-red-200 text-red-500"
                            : "border-gray-200 text-dark-400 hover:border-red-200 hover:text-red-500"
                        }`}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={18}
                        className={isWishlisted ? "fill-current" : ""}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full border border-gray-200
                        text-dark-400 hover:border-gray-400 transition-all duration-200"
                      aria-label="Share product"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= Math.round(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-dark-700">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.reviewCount > 0 && (
                      <span className="text-sm text-dark-400">
                        ({product.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  {discountedPrice ? (
                    <>
                      <span className="text-2xl font-display font-bold text-dark-950">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-base text-dark-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-primary-500">
                        Save ${(product.price - discountedPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-display font-bold text-dark-950">
                      ${product.price?.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {product.description && (
                  <p className="text-sm text-dark-500 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="h-px bg-gray-100" />

                {/* Color Selector */}
                {availableColors.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-dark-900">
                        Color
                      </span>
                      <span className="text-sm text-dark-500 capitalize">
                        {selectedColor || "Select color"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((variant) => (
                        <button
                          key={variant.color}
                          onClick={() => setSelectedColor(variant.color)}
                          title={variant.color}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all
                            duration-200 hover:scale-110
                            ${
                              selectedColor === variant.color
                                ? "border-dark-950 scale-110 shadow-md"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          style={{
                            backgroundColor:
                              variant.colorHex || variant.color.toLowerCase(),
                          }}
                          aria-label={`Select color: ${variant.color}`}
                          aria-pressed={selectedColor === variant.color}
                        >
                          {selectedColor === variant.color && (
                            <Check
                              size={12}
                              className="absolute inset-0 m-auto text-white drop-shadow"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {availableSizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-dark-900">
                        Size
                      </span>
                      {selectedSize ? (
                        <span className="text-sm text-dark-500">
                          US {selectedSize}
                        </span>
                      ) : (
                        <span className="text-sm text-red-400">
                          Select a size
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map(({ size, stock }) => {
                        const outOfStock = stock === 0;
                        return (
                          <button
                            key={size}
                            onClick={() => !outOfStock && setSelectedSize(size)}
                            disabled={outOfStock}
                            className={`relative min-w-[44px] h-10 px-3 rounded-xl border text-sm
                              font-medium transition-all duration-200
                              ${
                                outOfStock
                                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                                  : selectedSize === size
                                    ? "border-dark-950 bg-dark-950 text-white shadow-md"
                                    : "border-gray-200 text-dark-700 hover:border-dark-400 hover:bg-gray-50"
                              }`}
                            aria-label={`Size ${size}${outOfStock ? " - Out of stock" : ""}`}
                            aria-pressed={selectedSize === size}
                          >
                            {size}
                            {outOfStock && (
                              <span
                                className="absolute inset-0 flex items-center
                                justify-center"
                              >
                                <span
                                  className="absolute w-full h-px bg-gray-300
                                  rotate-45 transform"
                                />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {/* Low Stock Warning */}
                    {selectedVariantStock > 0 && selectedVariantStock <= 5 && (
                      <p className="text-xs text-amber-600 font-medium mt-2">
                        ⚠ Only {selectedVariantStock} left in stock!
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity Selector */}
                <div>
                  <span className="text-sm font-semibold text-dark-900 block mb-2.5">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange("dec")}
                        disabled={quantity <= 1}
                        className="px-3 py-2.5 hover:bg-gray-50 disabled:opacity-40
                          disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span
                        className="px-4 py-2.5 text-sm font-semibold min-w-[3rem]
                        text-center border-x border-gray-200"
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("inc")}
                        disabled={quantity >= 10}
                        className="px-3 py-2.5 hover:bg-gray-50 disabled:opacity-40
                          disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {isOutOfStock && (
                      <span className="text-sm text-red-500 font-medium">
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── Sticky Footer: CTA Buttons ─── */}
              <div className="border-t bg-white p-4 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    cartLoading ||
                    isOutOfStock ||
                    (availableSizes.length > 0 && !selectedSize)
                  }
                  className={`w-full flex items-center justify-center gap-2.5 py-3.5
                    rounded-2xl font-semibold text-sm transition-all duration-300
                    ${
                      addedToCart
                        ? "bg-emerald-500 text-white"
                        : isOutOfStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-dark-950 text-white hover:bg-dark-800 active:scale-[0.98]"
                    }
                    disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <AnimatePresence mode="wait">
                    {cartLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white
                          rounded-full animate-spin"
                      />
                    ) : addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={18} />
                        Added to Cart!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <Link
                  to={`/products/${product.slug || product._id}`}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3
                    rounded-2xl border border-gray-200 text-sm font-semibold
                    text-dark-700 hover:border-dark-400 hover:bg-gray-50
                    transition-all duration-200"
                >
                  <ExternalLink size={16} />
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductQuickView;
