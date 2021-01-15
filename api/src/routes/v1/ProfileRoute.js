import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import ProfileValidator from '../../validators/profile';
import CartValidator from '../../validators/cart';
import paginate from '../../middlewares/paginate';
import formHandler from '../../middlewares/formHandler';
import ProfileController from '../../controllers/ProfileController';

const router = Router();

router.route('/')
    .get(authenticate, ProfileController.fetchProfile)
    .patch(authenticate, ProfileValidator.validateBodyOnUpdate, ProfileController.updateProfile);

router.patch('/avatar', authenticate, formHandler.single('avatar', ['image']), ProfileController.uploadAvatar);

router.get('/payments', authenticate, paginate, ProfileController.fetchPaymentHistory);
router.get('/enrollments', authenticate, paginate, ProfileController.fetchCoursesEnrolled);
router.get('/courses', authenticate, paginate, ProfileController.fetchCoursesCreated);
router.get('/orders', authenticate, paginate, ProfileController.fetchOrders);

// USER'S CART
router.route('/cart')
    .get(authenticate, paginate, ProfileController.fetchCart);

router.route('/cart/items')
    .post(authenticate, CartValidator.validateBodyOnCreate, ProfileController.addToCart)
    .delete(authenticate, ProfileController.clearCart);

router.route('/cart/items/:itemId')
    .patch(authenticate, CartValidator.validateBodyOnUpdate, ProfileController.updateCartItem)
    .delete(authenticate, ProfileController.removeCartItem);

router.route('/cart/checkout')
    .post(authenticate, CartValidator.validateBodyOnCheckout, ProfileController.checkout);

export default router;
