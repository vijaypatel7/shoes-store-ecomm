import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  paymentWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', paymentWebhook); // No auth - Razorpay sends this

export default router;