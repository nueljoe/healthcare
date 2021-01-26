import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import initiateTransaction from '../../middlewares/initiateTransaction';
import OrderValidator from '../../validators/cart';
import paginate from '../../middlewares/paginate';
import MessageThreadController from '../../controllers/MessageThreadController';

const router = Router();

router.route('/')
    .post(authenticate, initiateTransaction, MessageThreadController.openThread)
    .get(authenticate, paginate, MessageThreadController.fetchThreads)

router.route('/:id')
    .delete(authenticate, initiateTransaction, MessageThreadController.deleteThread);

router.route('/:id/messages')
    .post(authenticate, initiateTransaction, MessageThreadController.postMessage)
    .get(authenticate, paginate, MessageThreadController.fetchThreadMessages)

router.route('/:id/messages/status')
    .patch(authenticate, initiateTransaction, MessageThreadController.updateReadState);

router.route('/:id/messages/:messageId')
    .delete(authenticate, initiateTransaction, MessageThreadController.deleteMessage);

export default router;
