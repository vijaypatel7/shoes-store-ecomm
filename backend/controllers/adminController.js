import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    console.log('Dashboard stats called');

    const [totalUsers, totalProducts, totalOrders, revenueResult] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $match: {
              paymentStatus: 'paid',
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: '$totalAmount',
              },
            },
          },
        ]),
      ]);

    console.log('Counts loaded successfully');

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    console.log('Recent orders loaded');

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log('Status aggregation loaded');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    console.error('DASHBOARD ERROR');
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("user", "name email"),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      orders,
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

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
    };

    // Required by schema
    productData.gender = req.body.gender || "Unisex";

    // Convert sizes
    if (req.body.sizes) {
      const sizes = Array.isArray(req.body.sizes)
        ? req.body.sizes
        : [req.body.sizes];

      productData.sizes = sizes.map((size) => ({
        size: Number(size),
        stock: Number(req.body.stock || 0),
      }));
    }

    // Images
    if (req.files?.length) {
      productData.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.name,
      }));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, message: "Product deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueData = async (req, res) => {
  try {
    const period = req.query.period || "7days";

    let days = 7;

    switch (period) {
      case "30days":
        days = 30;
        break;
      case "3months":
        days = 90;
        break;
      case "1year":
        days = 365;
        break;
      default:
        days = 7;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const chartData = revenue.map((item) => ({
      date: item._id,
      revenue: item.revenue,
    }));

    res.json({
      success: true,
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 5);
    const threshold = Number(req.query.threshold || 10);

    const products = await Product.find({
      totalStock: { $lte: threshold },
      isActive: true,
    })
      .sort({ totalStock: 1 })
      .limit(limit);

    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      stock: product.totalStock,
      image: product.images?.[0]?.url || null,
    }));

    res.json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error('Low stock products error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnalyticsSummary = async (req, res) => {
  try {
    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;
    const totalOrders = await Order.countDocuments();
    const newUsers = await User.countDocuments();

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      totalRevenue,
      revenueChange: 0,
      totalOrders,
      ordersChange: 0,
      newUsers,
      usersChange: 0,
      avgOrderValue,
      avgOrderChange: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsCharts = async (req, res) => {
  try {
    const period = req.query.period || "7days";

    let days = 7;

    switch (period) {
      case "30days":
        days = 30;
        break;
      case "3months":
        days = 90;
        break;
      case "1year":
        days = 365;
        break;
      default:
        days = 7;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    //
    // REVENUE
    //

    const revenueRaw = await Order.aggregate([
  {
    $match: {
      paymentStatus: "paid",
      createdAt: {
        $gte: startDate,
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt",
        },
      },
      revenue: {
        $sum: "$totalAmount",
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
]);

    const revenueMap = new Map(
      revenueRaw.map((item) => [item._id, item.revenue]),
    );

    const revenue = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toISOString().split("T")[0];

      revenue.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: revenueMap.get(key) || 0,
      });
    }
    //
    // ORDERS
    //
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const ordersChart = orders.map((o) => ({
      date: o._id,
      orders: o.orders,
    }));

    //
    // CATEGORY SALES
    //
    const categoriesRaw = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product.category",
          value: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },
    ]);

    const categories = categoriesRaw.map((c) => ({
      name: c._id || "Other",
      value: c.value,
    }));

    //
    // TOP PRODUCTS
    //
    const topProductsRaw = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          unitsSold: {
            $sum: "$items.quantity",
          },
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
    ]);

    const topProducts = topProductsRaw.map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0]?.url || null,
      brand: item.product.brand,
      category: item.product.category,
      unitsSold: item.unitsSold,
      revenue: item.revenue,
      growth: 0,
    }));

    //
    // USER GROWTH
    //
    const usersRaw = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          newUsers: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    let runningTotal = 0;

    const userGrowth = usersRaw.map((u) => {
      runningTotal += u.newUsers;

      return {
        date: u._id,
        newUsers: u.newUsers,
        totalUsers: runningTotal,
      };
    });

    res.json({
      revenue,
      orders: ordersChart,
      categories,
      topProducts,
      userGrowth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

 export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const rows = [
      [
        'Order ID',
        'Customer',
        'Email',
        'Status',
        'Total Amount',
        'Payment Status',
        'Date',
      ].join(','),
    ];

    orders.forEach((order) => {
      rows.push(
        [
          order._id,
          `"${order.user?.name || ''}"`,
          `"${order.user?.email || ''}"`,
          order.status,
          order.totalAmount,
          order.paymentStatus,
          order.createdAt.toISOString(),
        ].join(',')
      );
    });

    const csv = rows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=orders.csv'
    );

    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};