import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import ProfileValidator from '../../validators/profile';
import paginate from '../../middlewares/paginate';
import fileHandler from '../../middlewares/fileHandler';
import ProfileController from '../../controllers/ProfileController';

const router = Router();

router.route('/')
    .get(authenticate, ProfileController.fetchProfile)
    .patch(authenticate, ProfileValidator.validateBodyOnUpdate, ProfileController.updateProfile);

router.patch('/avatar', authenticate, fileHandler.single('avatar', ['image']), ProfileController.uploadAvatar);

router.get('/payments', authenticate, paginate, ProfileController.fetchPaymentHistory);
router.get('/enrollments', authenticate, paginate, ProfileController.fetchCoursesEnrolled);
router.get('/courses', authenticate, paginate, ProfileController.fetchCoursesCreated);

export default router;
