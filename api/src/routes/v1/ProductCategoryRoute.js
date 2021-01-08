import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import pagination from '../../middlewares/paginate';
import ProductCategoryValidator from '../../validators/category';
import ProductCategoryController from '../../controllers/ProductCategoryController';

const router = Router();

router.route('/')
    .post(authenticate, ProductCategoryValidator.validateBodyOnCreate, ProductCategoryController.createCategory)
    .get(pagination, ProductCategoryController.fetchCategories);

router.route('/:id')
    .patch(authenticate, ProductCategoryValidator.validateBodyOnUpdate, ProductCategoryController.updateCategory)
    .delete(authenticate, ProductCategoryController.deleteCategory);

router.route('/:id/subcategories')
    .get(ProductCategoryController.fetchSubcategories);

export default router;
