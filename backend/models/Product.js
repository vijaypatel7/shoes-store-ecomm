import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    brand: {
      type: String,
      required: true,
      enum: [
        'Nike',
        'Adidas',
        'Puma',
        'Reebok',
        'New Balance',
        'Converse',
        'Vans',
        'Jordan',
        'Under Armour',
        'Asics',
        'Skechers',
        'Fila',
        'Bata',
        'Woodland',
        'Red Tape',
      ],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Running',
        'Casual',
        'Formal',
        'Sports',
        'Sneakers',
        'Boots',
        'Sandals',
        'Loafers',
        'Slip-Ons',
        'Training',
      ],
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'Kids'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    sizes: [
      {
        size: Number,
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
    material: {
      type: String,
      default: 'Synthetic',
    },
    weight: {
      type: String,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // add random suffix for uniqueness
    this.slug += '-' + Math.random().toString(36).substring(2, 7);
  }

  // Calculate total stock
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((sum, s) => sum + s.stock, 0);
  }

  // Calculate discount
  if (this.originalPrice && this.price) {
    this.discount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  next();
});

// Indexes for performance
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);