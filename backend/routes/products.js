import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFilters,
  getFeaturedProducts,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/filters', getFilters);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
export default router;