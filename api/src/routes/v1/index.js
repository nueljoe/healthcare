import { Router } from 'express';
import AuthRoute from './AuthRoute';
import SubscriptionRoute from './SubscriptionRoute';
import CourseCategoryRoute from './CourseCategoryRoute';
import CourseRoute from './CourseRoute';
import PaymentRoute from './PaymentRoute';
import ProfileRoute from './ProfileRoute';
import ProductCategoryRoute from './ProductCategoryRoute';
import ProductRoute from './ProductRoute';

const router = Router();

router.use('/auth', AuthRoute);
router.use('/subscriptions', SubscriptionRoute);
router.use('/course-categories', CourseCategoryRoute);
router.use('/courses', CourseRoute);
router.use('/payments', PaymentRoute);
router.use('/me', ProfileRoute);
router.use('/product-categories', ProductCategoryRoute);
router.use('/products', ProductRoute);

router.use('/', (req, res) => {
    res.status(200).json({
        status:'success',
        message: 'Welcome to the version one of our API'
    });
});

export default router;
