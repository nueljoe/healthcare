import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import paginate from '../../middlewares/paginate';
import initiateTransaction from '../../middlewares/initiateTransaction';
import CourseSubscriptionValidator from '../../validators/courseSubscription';
import CourseSubscriptionController from '../../controllers/CourseSubscriptionController';

const router = Router();

router.route('/')
    .post(authenticate, initiateTransaction, CourseSubscriptionValidator.validateBodyOnCreate, CourseSubscriptionController.subscribe)
    .get(authenticate, paginate, CourseSubscriptionController.fetchSubscriptions)
    // .delete(CourseSubscriptionValidator.validateBodyOnDelete, CourseSubscriptionController.unsubscribe);

router.route('/:id')
    // .patch(CourseSubscriptionValidator.validateBodyOnUpdate, CourseSubscriptionController.updateSubscription)
    .get(authenticate.inRelaxedMode, CourseSubscriptionController.fetchSubscription);

export default router;
