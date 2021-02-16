import { Router } from 'express';
import AuthRoute from './AuthRoute';
import SubscriptionRoute from './SubscriptionRoute';
import CourseCategoryRoute from './CourseCategoryRoute';
import CourseRoute from './CourseRoute';
import PaymentRoute from './PaymentRoute';
import ProfileRoute from './ProfileRoute';
import ProductCategoryRoute from './ProductCategoryRoute';
import ProductRoute from './ProductRoute';
import OrderRoute from './OrderRoute';
import ForumDiscussionRoute from './ForumDiscussionRoute';
import MessageThreadRoute from './MessageThreadRoute';
import SubscriptionPlanRoute from './SubscriptionPlanRoute';
import CourseSubscriptionRoute from './CourseSubscriptionRoute';

const router = Router();

router.use('/auth', AuthRoute);
router.use('/subscriptions', SubscriptionRoute);
router.use('/subscription-plans', SubscriptionPlanRoute);
router.use('/course-subscriptions', CourseSubscriptionRoute);
router.use('/course-categories', CourseCategoryRoute);
router.use('/courses', CourseRoute);
router.use('/payments', PaymentRoute);

router.use('/me', ProfileRoute);
router.use('/product-categories', ProductCategoryRoute);
router.use('/products', ProductRoute);
router.use('/orders', OrderRoute);
router.use('/discussions', ForumDiscussionRoute);
router.use('/message-threads', MessageThreadRoute);

router.use('/', (req, res) => {
    res.status(200).json({
        status:'success',
        message: 'Welcome to the version one of our API'
    });
});

export default router;
