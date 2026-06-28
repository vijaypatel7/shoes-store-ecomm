import { Router } from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getRevenueData,
  getLowStockProducts,
  getAnalyticsSummary,
  getAnalyticsCharts,
  getAllProducts,
  exportOrders,
} from '../controllers/adminController.js';

import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import upload from "../middleware/upload.js";
const router = Router();

router.post(
  "/products",
  upload.array("images", 5),
  createProduct
);

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/revenue', getRevenueData);
router.get('/products', getAllProducts);
router.get('/products/low-stock', getLowStockProducts);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/users', getAllUsers);
router.get('/analytics/summary', getAnalyticsSummary);
router.get('/analytics/charts', getAnalyticsCharts);
router.get('/orders/export', exportOrders);

export default router;