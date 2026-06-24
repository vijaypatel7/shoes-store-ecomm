import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      brand,
      category,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      sort = '-createdAt',
      search,
      featured,
      newArrival,
      bestseller,
    } = req.query;

    const query = { isActive: true };

    if (brand) {
      query.brand = { $in: brand.split(',') };
    }
    if (category) {
      query.category = { $in: category.split(',') };
    }
    if (gender) {
      query.gender = { $in: gender.split(',') };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) {
      query['sizes.size'] = { $in: size.split(',').map(Number) };
      query['sizes.stock'] = { $gt: 0 };
    }
    if (color) {
      query['colors.name'] = {
        $in: color.split(',').map((c) => new RegExp(c, 'i')),
      };
    }
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestseller === 'true') query.isBestseller = true;
    if (search) {
      query.$text = { $search: search };
    }

    // Sort mapping
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { 'rating.count': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getFilters = async (req, res) => {
  try {
    const [brands, categories, genders, priceRange] = await Promise.all([
      Product.distinct('brand', { isActive: true }),
      Product.distinct('category', { isActive: true }),
      Product.distinct('gender', { isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      filters: {
        brands: brands.sort(),
        categories: categories.sort(),
        genders,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 50000 },
        sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const [featured, newArrivals, bestsellers] = await Promise.all([
      Product.find({ isFeatured: true, isActive: true }).limit(8).lean(),
      Product.find({ isNewArrival: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Product.find({ isBestseller: true, isActive: true })
        .sort({ 'rating.count': -1 })
        .limit(8)
        .lean(),
    ]);

    res.json({ success: true, featured, newArrivals, bestsellers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

