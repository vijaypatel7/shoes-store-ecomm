import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  X,
} from "lucide-react";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SizeSelector from "../components/product/SizeSelector";
import ColorSelector from "../components/product/ColorSelector";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/ui/Loader";
import { useWishlist } from "../context/WishlistContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [sizeError, setSizeError] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlist = product ? isInWishlist(product._id) : false;
  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/products/slug/${slug}`);
      setProduct(data.product);
      setSelectedColor(data.product.colors?.[0] || "");
      fetchRelated(data.product.category, data.product._id);
      await fetchReviews(data.product._id);
    } catch {
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category, currentId) => {
    try {
      const { data } = await API.get("/products", {
        params: { category, limit: 4 },
      });
      setRelatedProducts(
        data.products.filter((p) => p._id !== currentId).slice(0, 4),
      );
    } catch {
      // silent fail
    }
  };
  const fetchReviews = async (id) => {
    if (!id) return;
    try {
      const { data } = await API.get(`/reviews/product/${id}`);
      setReviews(data.reviews || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, selectedSize, selectedColor, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch {
      // handle error
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post(`/reviews`, {
        productId: product._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: "" });
      await fetchReviews(product._id);
    } catch {
      // handle error
    } finally {
      setSubmittingReview(false);
    }
  };

  const discountedPrice = product
    ? product.price - (product.price * (product.discount || 0)) / 100
    : 0;

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images.map((img) => img.url)
      : ["/placeholder.jpg"];
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <nav className="flex items-center gap-2 text-sm text-dark-400">
          <button
            onClick={() => navigate("/")}
            className="hover:text-dark-900 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/shop")}
            className="hover:text-dark-900 transition-colors"
          >
            Shop
          </button>
          <span>/</span>
          <button
            onClick={() => navigate(`/shop?category=${product.category}`)}
            className="hover:text-dark-900 transition-colors"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-dark-900 truncate max-w-[150px]">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div
                  className="absolute top-4 left-4 bg-red-500 text-white text-xs
                  font-bold px-2.5 py-1 rounded-full"
                >
                  -{product.discount}%
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={async () => {
                  if (wishlist) {
                    await removeFromWishlist(product._id);
                  } else {
                    await addToWishlist(product._id);
                  }
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full
                  shadow-md flex items-center justify-center transition-all
                  hover:scale-110"
              >
                <Heart
                  size={18}
                  className={
                    wishlist ? "fill-red-500 text-red-500" : "text-dark-400"
                  }
                />
              </button>

              {/* Navigation arrows (if multiple images) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage(
                        (prev) => (prev - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white
                      rounded-full shadow-md flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white
                      rounded-full shadow-md flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2
                      transition-all ${
                        activeImage === idx
                          ? "border-dark-950"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Brand & Share */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => navigate(`/shop?brand=${product.brand}`)}
                className="text-sm font-semibold text-primary-500 hover:text-primary-600
                  uppercase tracking-wider transition-colors"
              >
                {product.brand}
              </button>
              <button
                onClick={() =>
                  navigator.share?.({
                    title: product.name,
                    url: window.location.href,
                  })
                }
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Share2 size={18} className="text-dark-400" />
              </button>
            </div>

            <h1 className="text-2xl lg:text-3xl font-display font-bold text-dark-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(product.rating?.average || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-dark-500">
                {product.rating?.average?.toFixed(1) || "0.0"}(
                {product.rating?.count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-dark-900">
                ₹{discountedPrice.toLocaleString("en-IN")}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-dark-400 line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <ColorSelector
                  colors={product.colors}
                  selected={selectedColor}
                  onChange={setSelectedColor}
                />
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-6">
              <SizeSelector
                sizes={product.sizes || []}
                selectedSize={selectedSize}
                onSelect={(size) => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
              />
              {sizeError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  Please select a size before adding to cart.
                </motion.p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-dark-700">
                Quantity
              </span>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50
                    transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50
                    transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-sm text-orange-500 font-medium">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center
                justify-center gap-2 transition-all mb-3
                ${
                  product.stock === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : addedSuccess
                      ? "bg-green-500 text-white"
                      : "bg-dark-950 text-white hover:bg-dark-800 active:scale-[0.98]"
                }`}
            >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : addedSuccess ? (
                <>✓ Added to Cart</>
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Add to Cart
                </>
              )}
            </button>

            {/* Divider */}
            <div className="border-t my-6" />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: Truck,
                  label: "Free Delivery",
                  sub: "On orders over ₹999",
                },
                {
                  icon: RotateCcw,
                  label: "Easy Returns",
                  sub: "30-day returns",
                },
                { icon: Shield, label: "Authentic", sub: "100% genuine" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <Icon size={18} className="text-dark-600" />
                  </div>
                  <span className="text-xs font-semibold text-dark-800">
                    {label}
                  </span>
                  <span className="text-[10px] text-dark-400">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mt-16">
          {/* Tab Headers */}
          <div className="flex border-b mb-8">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-colors
                  border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-dark-950 text-dark-900"
                      : "border-transparent text-dark-400 hover:text-dark-700"
                  }`}
              >
                {tab}{" "}
                {tab === "reviews" &&
                  reviews.length > 0 &&
                  `(${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Description Tab */}
          {activeTab === "description" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <p className="text-dark-600 leading-relaxed mb-6">
                {product.description || "No description available."}
              </p>
              {product.features?.length > 0 && (
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-dark-600"
                    >
                      <span className="text-primary-500 mt-0.5">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-8"
            >
              {/* Review List */}
              {reviews.length === 0 ? (
                <p className="text-dark-400 text-sm">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-gray-50 rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm text-dark-900">
                            {review.user?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-dark-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                s <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 fill-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-dark-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Write Review */}
              {user ? (
                <div className="bg-white border rounded-2xl p-6">
                  <h3 className="font-semibold text-dark-900 mb-4">
                    Write a Review
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-2 block">
                        Your Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setReviewForm((p) => ({ ...p, rating: star }))
                            }
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={
                                star <= reviewForm.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 fill-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-1.5 block">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm((p) => ({
                            ...p,
                            comment: e.target.value,
                          }))
                        }
                        rows={4}
                        required
                        placeholder="Share your experience with this product..."
                        className="w-full px-4 py-3 border rounded-xl text-sm resize-none
                          focus:outline-none focus:ring-2 focus:ring-dark-950/20
                          focus:border-dark-950 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm
                        font-medium hover:bg-dark-800 transition-colors
                        disabled:opacity-60 flex items-center gap-2"
                    >
                      {submittingReview ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : null}
                      Submit Review
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <p className="text-dark-500 text-sm mb-3">
                    Please sign in to write a review.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-dark-950 text-white rounded-xl text-sm
                      font-medium hover:bg-dark-800 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-dark-900 mb-6">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} loading={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
