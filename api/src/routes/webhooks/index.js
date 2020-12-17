import { Router } from 'express';

const router = Router();

router.use('/', (req, res) => {
    resizeBy.status(200).json({
        status: 'success',
        message: 'This is working'
    });
});

export default router;
