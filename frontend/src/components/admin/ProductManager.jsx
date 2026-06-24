import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Check,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Running",
  "Basketball",
  "Casual",
  "Training",
  "Lifestyle",
  "Sneakers",
];
const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Reebok",
  "Converse",
  "Vans",
];
const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

const EMPTY_FORM = {
  name: "",
  brand: "",
  category: "",
  price: "",
  discount: "",
  description: "",
  sizes: [],
  colors: [],
  stock: "",
  isNew: false,
  isBestseller: false,
  isFeatured: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
);

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-dark-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertTriangle size={10} />
        {error}
      </p>
    )}
  </div>
);

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirmModal = ({ product, onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex
        items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-dark-950">Delete Product</h3>
            <p className="text-xs text-dark-400">
              This action cannot be undone
            </p>
          </div>
        </div>
        <p className="text-sm text-dark-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-dark-900">"{product.name}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border rounded-xl text-sm font-medium
              text-dark-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm
              font-semibold hover:bg-red-600 transition-colors disabled:opacity-60
              flex items-center justify-center gap-2"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── Product Form Modal ───────────────────────────────────────────────────────
const ProductFormModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "",
          price: product.price || "",
          discount: product.discount || "",
          description: product.description || "",
          sizes: product.sizes || [],
          colors: (product.colors || []).map((c) =>
            typeof c === "string" ? c : c.name,
          ),
          stock: product.stock || "",
          isNew: product.isNew || false,
          isBestseller: product.isBestseller || false,
          isFeatured: product.isFeatured || false,
        }
      : EMPTY_FORM,
  );
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(product?.images || []);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [colorInput, setColorInput] = useState("");
  const fileInputRef = useRef(null);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    // If it's a new file (not existing URL)
    const existingCount = product?.images?.length || 0;
    if (index >= existingCount) {
      setImages((prev) => prev.filter((_, i) => i !== index - existingCount));
    }
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b),
    }));
  };

  const addColor = () => {
    const trimmed = colorInput.trim();
    if (!trimmed) return;
    if (form.colors.includes(trimmed)) {
      toast.error("Color already added");
      return;
    }
    setForm((prev) => ({ ...prev, colors: [...prev.colors, trimmed] }));
    setColorInput("");
  };

  const removeColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.brand) errs.brand = "Brand is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = "Valid price is required";
    if (
      form.discount &&
      (isNaN(form.discount) ||
        Number(form.discount) < 0 ||
        Number(form.discount) > 100)
    )
      errs.discount = "Discount must be between 0 and 100";
    if (!form.description.trim()) errs.description = "Description is required";
    if (form.sizes.length === 0) errs.sizes = "Select at least one size";
    if (!product && previewUrls.length === 0)
      errs.images = "At least one image is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the errors below");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });
      images.forEach((img) => formData.append("images", img));

      let response;
      if (product) {
        response = await API.put(`/admin/products/${product._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        response = await API.post("/admin/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully");
      }
      console.log("CREATE RESPONSE:", response.data);
onSave(response.data.product);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex
          items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh]
            overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div>
              <h2 className="font-display font-bold text-dark-950 text-lg">
                {product ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-dark-400 mt-0.5">
                {product
                  ? "Update product details"
                  : "Fill in product information"}
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

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          >
            {/* Images */}
            <FormField
              label="Product Images"
              error={errors.images}
              required={!product}
            >
              <div className="flex flex-wrap gap-3">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden
                      border-2 border-gray-200 group"
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                        flex items-center justify-center transition-opacity"
                    >
                      <X size={16} className="text-white" />
                    </button>
                    {idx === 0 && (
                      <span
                        className="absolute bottom-0 left-0 right-0 bg-dark-950/80
                        text-white text-[9px] text-center py-0.5"
                      >
                        Main
                      </span>
                    )}
                  </div>
                ))}
                {previewUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300
                      flex flex-col items-center justify-center gap-1
                      hover:border-dark-400 hover:bg-gray-50 transition-all text-dark-400"
                  >
                    <Upload size={18} />
                    <span className="text-[10px]">Upload</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-dark-400 mt-1.5">
                <ImageIcon size={11} className="inline mr-1" />
                Upload up to 5 images. First image will be the main product
                image.
              </p>
            </FormField>

            {/* Name */}
            <FormField label="Product Name" error={errors.name} required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Air Max 270 React"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                  text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                  focus:border-dark-400 transition-all"
              />
            </FormField>

            {/* Brand + Category */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Brand" error={errors.brand} required>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                    focus:border-dark-400 transition-all bg-white appearance-none
                    cursor-pointer"
                >
                  <option value="">Select brand</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Category" error={errors.category} required>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                    focus:border-dark-400 transition-all bg-white appearance-none
                    cursor-pointer"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Price + Discount + Stock */}
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Price ($)" error={errors.price} required>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                    focus:border-dark-400 transition-all"
                />
              </FormField>
              <FormField label="Discount (%)" error={errors.discount}>
                <input
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                    focus:border-dark-400 transition-all"
                />
              </FormField>
              <FormField label="Stock Quantity">
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                    focus:border-dark-400 transition-all"
                />
              </FormField>
            </div>

            {/* Description */}
            <FormField label="Description" error={errors.description} required>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the product..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                  text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                  focus:border-dark-400 transition-all resize-none"
              />
            </FormField>

            {/* Sizes */}
            <FormField
              label="Available Sizes (US)"
              error={errors.sizes}
              required
            >
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`min-w-[42px] h-9 px-2 rounded-xl border text-xs
                      font-medium transition-all duration-150
                      ${
                        form.sizes.includes(size)
                          ? "bg-dark-950 text-white border-dark-950 shadow-sm"
                          : "border-gray-200 text-dark-600 hover:border-dark-400"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {form.sizes.length > 0 && (
                <p className="text-xs text-dark-400 mt-1.5">
                  Selected: {form.sizes.join(", ")}
                </p>
              )}
            </FormField>

            {/* Colors */}
            <FormField label="Available Colors">
              <div className="flex gap-2 mb-2">
                <input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addColor();
                    }
                  }}
                  placeholder="e.g. Black, White, Red..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                    focus:border-dark-400 transition-all"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2.5 bg-dark-950 text-white rounded-xl text-sm
                    font-medium hover:bg-dark-800 transition-colors"
                >
                  Add
                </button>
              </div>
              {form.colors.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {form.colors.map((color, index) => (
      <span
        key={`${color}-${index}`}
        className="flex items-center gap-1.5 px-3 py-1 bg-gray-100
          text-dark-700 rounded-full text-xs font-medium"
      >
        {color}
        <button
          type="button"
          onClick={() => removeColor(color)}
          className="hover:text-red-500 transition-colors"
        >
          <X size={11} />
        </button>
      </span>
    ))}
  </div>
)}
            </FormField>

            {/* Flags */}
            <FormField label="Product Labels">
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "isNew", label: "New Arrival" },
                  { name: "isBestseller", label: "Bestseller" },
                  { name: "isFeatured", label: "Featured" },
                ].map(({ name, label }) => (
                  <label
                    key={name}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center
                        justify-center transition-all duration-150
                        ${
                          form[name]
                            ? "bg-dark-950 border-dark-950"
                            : "border-gray-300 group-hover:border-dark-400"
                        }`}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, [name]: !prev[name] }))
                      }
                    >
                      {form[name] && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-dark-700">{label}</span>
                  </label>
                ))}
              </div>
            </FormField>

            {/* Preview price */}
            {form.price && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p
                  className="text-xs font-semibold text-dark-400 uppercase
                  tracking-wider mb-2"
                >
                  Price Preview
                </p>
                <div className="flex items-baseline gap-3">
                  {form.discount > 0 ? (
                    <>
                      <span className="text-xl font-bold text-dark-950">
                        ₹
                        {(
                          Number(form.price) -
                          (Number(form.price) * Number(form.discount)) / 100
                        ).toFixed(2)}
                      </span>
                      <span className="text-sm text-dark-400 line-through">
                        ${Number(form.price).toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-primary-500">
                        {form.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-dark-950">
                      ₹{Number(form.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border rounded-xl text-sm font-medium
                text-dark-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm
                font-semibold hover:bg-dark-800 transition-colors
                disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <RefreshCw size={14} className="animate-spin" />}
              {product ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
// ─── Helpers ──────────────────────────────────────────────────────────────

const getImageUrl = (url) => {
  if (!url) return "/placeholder.png";

  if (url.startsWith("http")) {
    return url;
  }

  return `http://localhost:5001${url}`;
};


// ─── Main ProductManager ──────────────────────────────────────────────────────
const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
  setLoading(true);

  try {
    const { data } = await API.get("/admin/products", {
      params: {
        page,
        limit: 10,
        search: search || undefined,
        category: categoryFilter || undefined,
      },
    });

    console.log("Products API Response:", data);

    setProducts(data.products || []);
    setPagination(data.pagination || {});
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch products");
  } finally {
    setLoading(false);
  }
}, [page, search, categoryFilter]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, page]);

  const handleSave = (savedProduct) => {
  console.log("savedProduct", savedProduct);

  if (!savedProduct || !savedProduct._id) {
    toast.error("Invalid product returned from server");
    fetchProducts();
    return;
  }

  setProducts((prev) => {
    const exists = prev.find(
      (p) => p && p._id === savedProduct._id
    );

    if (exists) {
      return prev.map((p) =>
        p && p._id === savedProduct._id
          ? savedProduct
          : p
      );
    }

    return [savedProduct, ...prev];
  });
};

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/admin/products/${deleteTarget._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-950">
            Product Manager
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            {pagination.total || 0} total products
          </p>
        </div>
        <button
          onClick={() => {
            setEditProduct(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-dark-950 text-white
            rounded-xl text-sm font-semibold hover:bg-dark-800 transition-colors
            shadow-sm"
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      {/* Filters */}
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
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200
                text-sm focus:outline-none focus:ring-2 focus:ring-dark-950/10
                focus:border-dark-400 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative" data-cat-dropdown>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-xl
                text-sm font-medium hover:border-dark-300 transition-colors
                bg-white whitespace-nowrap"
            >
              {categoryFilter || "All Categories"}
              <ChevronDown
                size={14}
                className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-xl
                    shadow-xl border py-1.5 z-20"
                >
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors
                      hover:bg-gray-50
                      ${!categoryFilter ? "font-semibold text-dark-950" : "text-dark-600"}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors
                        hover:bg-gray-50
                        ${
                          categoryFilter === cat
                            ? "font-semibold text-dark-950"
                            : "text-dark-600"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchProducts}
            className="p-2.5 border rounded-xl hover:bg-gray-50 transition-colors
              text-dark-400 flex-shrink-0"
            aria-label="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden"
      >
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Product",
                    "Brand",
                    "Category",
                    "Price",
                    "Stock",
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
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-14 text-dark-400 text-sm"
                    >
                      <Package size={32} className="mx-auto mb-3 opacity-30" />
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const discountedPrice =
                      product.discount > 0
                        ? product.price -
                          (product.price * product.discount) / 100
                        : null;
                    return (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
  src={getImageUrl(product.images?.[0]?.url)}
  alt={product.name}
  className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
  onError={(e) => {
    e.target.src = "/placeholder.png";
  }}
/>
                            <div className="min-w-0">
                              <p
                                className="font-medium text-dark-900 truncate
                                max-w-[180px]"
                              >
                                {product.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {product.isNew && (
                                  <span
                                    className="text-[9px] font-bold px-1.5
                                    py-0.5 bg-emerald-50 text-emerald-600
                                    rounded-full"
                                  >
                                    NEW
                                  </span>
                                )}
                                {product.isBestseller && (
                                  <span
                                    className="text-[9px] font-bold px-1.5
                                    py-0.5 bg-amber-50 text-amber-600 rounded-full"
                                  >
                                    BESTSELLER
                                  </span>
                                )}
                                {product.isFeatured && (
                                  <span
                                    className="text-[9px] font-bold px-1.5
                                    py-0.5 bg-indigo-50 text-indigo-600 rounded-full"
                                  >
                                    FEATURED
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Brand */}
                        <td className="px-5 py-4 text-dark-600">
                          {product.brand}
                        </td>
                        {/* Category */}
                        <td className="px-5 py-4">
                          <span
                            className="px-2.5 py-1 bg-gray-100 text-dark-600
                            rounded-full text-xs font-medium"
                          >
                            {product.category}
                          </span>
                        </td>
                        {/* Price */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-dark-950">
                              $
                              {discountedPrice
                                ? discountedPrice.toFixed(2)
                                : product.price?.toFixed(2)}
                            </span>
                            {discountedPrice && (
                              <span className="text-xs text-dark-400 line-through">
                                ${product.price?.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Stock */}
                        <td className="px-5 py-4">
                          <span
                            className={`font-semibold text-sm
                              ${
                                (product.totalStock ?? 0) === 0
                                  ? "text-red-500"
                                  : (product.totalStock ?? 0) <= 5
                                    ? "text-amber-500"
                                    : "text-dark-700"
                              }`}
                          >
                            {product.totalStock ?? 0}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs
                              font-semibold
                              ${
                                (product.totalStock ?? 0) === 0
                                  ? "bg-red-50 text-red-500"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                          >
                            {(product.totalStock ?? 0) === 0
                              ? "Out of Stock"
                              : "In Stock"}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditProduct(product);
                                setModalOpen(true);
                              }}
                              className="p-2 bg-indigo-50 text-indigo-600
                                rounded-lg hover:bg-indigo-100 transition-colors"
                              aria-label="Edit product"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(product)}
                              className="p-2 bg-red-50 text-red-500 rounded-lg
                                hover:bg-red-100 transition-colors"
                              aria-label="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
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
              <span className="font-medium">{pagination.total}</span> products
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border disabled:opacity-40
                  disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ProductFormModal
            product={editProduct}
            onClose={() => {
              setModalOpen(false);
              setEditProduct(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            product={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;
