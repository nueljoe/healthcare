import { Router } from 'express';
import AuthRoute from './AuthRoute';
import SubscriptionRoute from './SubscriptionRoute';
import CourseRoute from './CourseRoute';

const router = Router();

router.use('/auth', AuthRoute);
router.use('/subscriptions', SubscriptionRoute);
router.use('/courses', CourseRoute);

router.use('/', (req, res) => {
    res.status(200).json({
        status:'success',
        message: 'Welcome to the version one of our API'
    });
});

export default router;
