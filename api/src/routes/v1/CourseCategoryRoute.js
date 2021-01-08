import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import pagination from '../../middlewares/paginate';
import CourseCategoryValidator from '../../validators/category';
import CourseCategoryController from '../../controllers/CourseCategoryController';

const router = Router();

router.route('/')
    .post(authenticate, CourseCategoryValidator.validateBodyOnCreate, CourseCategoryController.createCategory)
    .get(pagination, CourseCategoryController.fetchCategories);

router.route('/:id')
    .patch(authenticate, CourseCategoryValidator.validateBodyOnUpdate, CourseCategoryController.updateCategory)
    .delete(authenticate, CourseCategoryController.deleteCategory);

router.route('/:id/subcategories')
    .get(CourseCategoryController.fetchSubcategories);

export default router;
