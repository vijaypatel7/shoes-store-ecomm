import Review from '../models/Review.js';
import Order from '../models/Order.js';

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate('user', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ product: productId }),
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        page: Number(page),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user already reviewed
    const existing = await Review.findOne({
      user: req.user._id,
      product: productId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'You already reviewed this product' });
    }

    // Check if verified purchase
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      paymentStatus: 'paid',
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!order,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};