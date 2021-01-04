import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import initiateTransaction from '../../middlewares/initiateTransaction';
import paginate from '../../middlewares/paginate';
import PaymentController from '../../controllers/PaymentController';

const router = Router();

router.get('/', authenticate, paginate, PaymentController.fetchPayments);

router.post('/verification', initiateTransaction, PaymentController.verifyPayment);

export default router;
