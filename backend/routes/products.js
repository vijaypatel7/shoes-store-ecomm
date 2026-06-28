import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFilters,
  getFeaturedProducts,
} from '../controllers/productController.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Product list
 */

router.get('/', getProducts);
router.get('/filters', getFilters);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
export default router;