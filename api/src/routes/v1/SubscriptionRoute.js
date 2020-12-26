import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import SubscriptionValidator from '../../validators/subscriptions';
import SubscriptionController from '../../controllers/SubscriptionController';

const router = Router();

router.route('/')
    .post(SubscriptionValidator.validateBodyOnCreate, SubscriptionController.createSubscription)
    .get(authenticate, SubscriptionController.fetchSubscriptions)
    .delete(SubscriptionValidator.validateBodyOnDelete, SubscriptionController.unsubscribe);

router.route('/:id')
    .patch(SubscriptionValidator.validateBodyOnUpdate, SubscriptionController.updateSubscription)
    .get(SubscriptionController.fetchSubscription);

export default router;
