import { Router } from 'express';
import APIv1 from './v1';
import webhooks from './webhooks';

const router = Router();

router.use('/v1', APIv1);

router.use('/webhooks', webhooks)

export default router;
