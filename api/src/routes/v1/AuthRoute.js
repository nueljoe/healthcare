import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

const router = Router();

router.post('/signup', AuthController.createAccount);
router.post('/signin', AuthController.signIn);

export default router;
