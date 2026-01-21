import { Router } from 'express';
import authRoutes from '../controllers/auth';
import productRoutes from '../controllers/product';
import cartRoutes from '../controllers/cart';
import checkoutRoutes from '../controllers/checkout';

const router = Router();

router.use(authRoutes);
router.use(productRoutes);
router.use(cartRoutes);
router.use(checkoutRoutes);

export default router;

