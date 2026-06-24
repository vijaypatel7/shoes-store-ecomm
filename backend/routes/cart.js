console.log('✅ CART ROUTES FILE LOADED');
import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Get cart
router.get('/', protect, getCart);


router.get('/test', (req, res) => {
  res.send('cart route works');
});

// Add item to cart
router.post('/add', (req,res,next)=>{
  console.log('POST /cart/add HIT');
  next();
}, protect, addToCart);
// Update quantity
router.put('/item/:itemId', protect, updateCartItem);

// Remove item
router.delete('/item/:itemId', protect, removeFromCart);

// Clear cart
router.delete('/clear', protect, clearCart);

export default router;