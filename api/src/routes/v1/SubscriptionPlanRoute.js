import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import SubscriptionPlanController from '../../controllers/SubscriptionPlanController';
import SubscriptionPlanValidator from '../../validators/subscriptionPlan';

const router = Router();

router.route('/')
    .post(authenticate, SubscriptionPlanValidator.validateBodyOnCreate, SubscriptionPlanController.create)
    .get(authenticate.inRelaxedMode, SubscriptionPlanController.fetchPlans);

router.route('/:id')
    .get(authenticate, SubscriptionPlanController.fetchPlan)
    .patch(authenticate, SubscriptionPlanValidator.validateBodyOnUpdate, SubscriptionPlanController.updatePlan)
    .delete(authenticate, SubscriptionPlanController.deletePlan);

export default router;
