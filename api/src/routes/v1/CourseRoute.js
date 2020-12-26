import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import CourseCategoryValidator from '../../validators/courseCategory';
import CourseCategoryController from '../../controllers/CourseCategoryController';

const router = Router();


// COURSE CATEGORIES
router.route('/categories')
    .post(CourseCategoryValidator.validateBodyOnCreate, CourseCategoryController.createCategory)
    .get(CourseCategoryController.fetchCategories)

router.route('/categories/:id')
    .patch(CourseCategoryValidator.validateBodyOnUpdate, CourseCategoryController.updateCategory)
    .delete(CourseCategoryController.deleteCategory);

router.route('/categories/:id/subcategories')
    .get(CourseCategoryController.fetchSubcategories);

export default router;
