import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import initiateTransaction from '../../middlewares/initiateTransaction';
import OrderValidator from '../../validators/cart';
import paginate from '../../middlewares/paginate';
import OrderController from '../../controllers/OrderController';

const router = Router();

router.route('/')
    .get(authenticate, paginate, OrderController.fetchOrders)

router.route('/:reference')
    .get(authenticate, OrderController.fetchOneOrder);

router.route('/:reference/delivery')
    .patch(authenticate, initiateTransaction, OrderController.markAsDelivered);

router.route('/:reference/cancel')
    .patch(authenticate, OrderController.cancelOrder);

export default router;
