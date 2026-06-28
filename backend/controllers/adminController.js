import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const previousMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const previousMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const [
      totalUsers,
      totalProducts,
      totalOrders,

      revenueResult,

      pendingOrders,
      deliveredOrders,
      paidOrders,

      currentMonthRevenue,
      previousMonthRevenue,

      currentMonthUsers,
      previousMonthUsers,

      currentMonthOrders,
      previousMonthOrders,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.countDocuments({
        status: "pending",
      }),

      Order.countDocuments({
        status: "delivered",
      }),

      Order.countDocuments({
        paymentStatus: "paid",
      }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: {
              $gte: currentMonthStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: {
              $gte: previousMonthStart,
              $lt: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      User.countDocuments({
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      User.countDocuments({
        createdAt: {
          $gte: previousMonthStart,
          $lt: previousMonthEnd,
        },
      }),

      Order.countDocuments({
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      Order.countDocuments({
        createdAt: {
          $gte: previousMonthStart,
          $lt: previousMonthEnd,
        },
      }),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email");

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    const currentRevenue =
      currentMonthRevenue[0]?.total || 0;

    const previousRevenue =
      previousMonthRevenue[0]?.total || 0;

    const calculateGrowth = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number(
        (((current - previous) / previous) * 100).toFixed(1)
      );
    };

    res.json({
      success: true,

      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        paidOrders,

        revenueGrowth: calculateGrowth(
          currentRevenue,
          previousRevenue
        ),

        userGrowth: calculateGrowth(
          currentMonthUsers,
          previousMonthUsers
        ),

        orderGrowth: calculateGrowth(
          currentMonthOrders,
          previousMonthOrders
        ),

        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

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
      const baseUrl = process.env.BACKEND_URL || "http://localhost:5001";

      productData.images = req.files.map((file) => ({
        url: `${baseUrl}/uploads/${file.filename}`,
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
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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
              timezone: "UTC",
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
    console.error("Low stock products error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnalyticsSummary = async (req, res) => {
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

    // Current Period
    const currentStart = new Date();
    currentStart.setDate(currentStart.getDate() - days);

    // Previous Period
    const previousStart = new Date();
    previousStart.setDate(previousStart.getDate() - days * 2);

    const previousEnd = new Date();
    previousEnd.setDate(previousEnd.getDate() - days);

    const [
      currentRevenueResult,
      previousRevenueResult,
      currentOrders,
      previousOrders,
      currentUsers,
      previousUsers,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: currentStart },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: {
              $gte: previousStart,
              $lt: previousEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      Order.countDocuments({
        createdAt: { $gte: currentStart },
      }),
      Order.countDocuments({
        createdAt: {
          $gte: previousStart,
          $lt: previousEnd,
        },
      }),
      User.countDocuments({
        createdAt: { $gte: currentStart },
      }),
      User.countDocuments({
        createdAt: {
          $gte: previousStart,
          $lt: previousEnd,
        },
      }),
    ]);

    const totalRevenue = currentRevenueResult[0]?.total || 0;
    const previousRevenue = previousRevenueResult[0]?.total || 0;

    const avgOrderValue =
      currentOrders > 0 ? totalRevenue / currentOrders : 0;

    const previousAvgOrderValue =
      previousOrders > 0 ? previousRevenue / previousOrders : 0;

    const calcGrowth = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number(
        (((current - previous) / previous) * 100).toFixed(1)
      );
    };

    res.json({
      totalRevenue,
      revenueChange: calcGrowth(
        totalRevenue,
        previousRevenue
      ),

      totalOrders: currentOrders,
      ordersChange: calcGrowth(
        currentOrders,
        previousOrders
      ),

      newUsers: currentUsers,
      usersChange: calcGrowth(
        currentUsers,
        previousUsers
      ),

      avgOrderValue,
      avgOrderChange: calcGrowth(
        avgOrderValue,
        previousAvgOrderValue
      ),
    });
  } catch (error) {
    console.error("Analytics Summary Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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
// TOP PRODUCTS WITH GROWTH
//

const previousStartDate = new Date();
previousStartDate.setDate(previousStartDate.getDate() - days * 2);

const previousEndDate = new Date();
previousEndDate.setDate(previousEndDate.getDate() - days);

// Current Period Products
const currentProducts = await Order.aggregate([
  {
    $match: {
      createdAt: {
        $gte: startDate,
      },
      paymentStatus: "paid",
    },
  },
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
]);

// Previous Period Products
const previousProducts = await Order.aggregate([
  {
    $match: {
      createdAt: {
        $gte: previousStartDate,
        $lt: previousEndDate,
      },
      paymentStatus: "paid",
    },
  },
  {
    $unwind: "$items",
  },
  {
    $group: {
      _id: "$items.product",
      revenue: {
        $sum: {
          $multiply: ["$items.quantity", "$items.price"],
        },
      },
    },
  },
]);

const previousRevenueMap = new Map(
  previousProducts.map((p) => [
    p._id.toString(),
    p.revenue,
  ])
);

const topProducts = await Promise.all(
  currentProducts.map(async (item) => {
    const product = await Product.findById(item._id);

    if (!product) return null;

    const previousRevenue =
      previousRevenueMap.get(item._id.toString()) || 0;

    let growth = 0;

    if (previousRevenue === 0) {
      growth = item.revenue > 0 ? 100 : 0;
    } else {
      growth = Number(
        (
          ((item.revenue - previousRevenue) /
            previousRevenue) *
          100
        ).toFixed(1)
      );
    }

    return {
      _id: product._id,
      name: product.name,
      image: product.images?.[0]?.url || null,
      brand: product.brand,
      category: product.category,
      unitsSold: item.unitsSold,
      revenue: item.revenue,
      growth,
    };
  })
);

const filteredTopProducts = topProducts.filter(Boolean);
    //
    // USER GROWTH
    //
    const existingUsersBeforePeriod = await User.countDocuments({
      createdAt: { $lt: startDate },
    });

    const usersRaw = await User.aggregate([
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
              timezone: "UTC",
            },
          },
          newUsers: { $sum: 1 },
        },
      },
    ]);

    const usersMap = new Map(usersRaw.map((u) => [u._id, u.newUsers]));

    let runningTotal = existingUsersBeforePeriod;

    const userGrowth = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
      )
        .toISOString()
        .split("T")[0];
      const newUsers = usersMap.get(key) || 0;

      runningTotal += newUsers;

      userGrowth.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        newUsers,
        totalUsers: runningTotal,
      });
    }

    res.json({
  revenue,
  orders: ordersChart,
  categories,
  topProducts: filteredTopProducts,
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
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const rows = [
      [
        "Order ID",
        "Customer",
        "Email",
        "Status",
        "Total Amount",
        "Payment Status",
        "Date",
      ].join(","),
    ];

    orders.forEach((order) => {
      rows.push(
        [
          order._id,
          `"${order.user?.name || ""}"`,
          `"${order.user?.email || ""}"`,
          order.status,
          order.totalAmount,
          order.paymentStatus,
          order.createdAt.toISOString(),
        ].join(","),
      );
    });

    const csv = rows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");

    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
