import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import pagination from '../../middlewares/paginate';
import formHandler from '../../middlewares/formHandler';
import initiateTransaction from '../../middlewares/initiateTransaction';
import ProductValidator from '../../validators/product';
import ProductController from '../../controllers/ProductController';

const router = Router();

router.route('/')
    .post(authenticate, formHandler.single('primary_img', ['image']), ProductValidator.validateBodyOnCreate, ProductController.createProduct)
    .get(pagination, ProductController.fetchProducts);

router.route('/:slug')
    .patch(authenticate, formHandler.single('primary_img', ['image']), ProductValidator.validateBodyOnUpdate, ProductController.updateProduct)
    .get(ProductController.fetchProduct)
    .delete(authenticate, ProductController.deleteProduct);

router.route('/:slug/images')
    .post(authenticate, formHandler.array('images', ['image'], 8), ProductValidator.validateBodyOnUpdate, ProductController.addProductImages)
    .get(ProductController.fetchProductImages)

router.route('/:slug/images/:imageId')
    .delete(authenticate, ProductController.removeProductImage);
    
router.route('/:slug/status')
    .patch(authenticate, ProductValidator.validateBodyOnStatusUpdate, ProductController.updateStatus);

// router.route('/:slug/enrollments').post(authenticate, initiateTransaction, ProductController.initiateProductEnrollment);

export default router;
