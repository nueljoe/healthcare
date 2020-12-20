import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import AuthController from '../../controllers/AuthController';

const router = Router();

router.post('/signup', AuthController.createAccount);
router.post('/verification/resend', AuthController.resendVerification);
router.get('/verification', AuthController.verifyAccount);
router.post('/signin', AuthController.signIn);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;
