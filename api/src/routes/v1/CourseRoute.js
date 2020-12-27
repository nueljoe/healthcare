import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import pagination from '../../middlewares/pagination';
import CourseCategoryValidator from '../../validators/courseCategory';
import CourseValidator from '../../validators/course';
import CourseCategoryController from '../../controllers/CourseCategoryController';
import CourseController from '../../controllers/CourseController';

const router = Router();

router.route('/')
    .post(authenticate, CourseValidator.validateBodyOnCreate, CourseController.createCourse)
    .get(pagination, CourseController.fetchCourses);

router.route('/:slug')
    .patch(authenticate, CourseValidator.validateBodyOnUpdate, CourseController.updateCourse)
    .get(CourseController.fetchCourse)
    .delete(authenticate, CourseController.deleteCourse);
    
router.route('/:slug/status')
    .patch(authenticate, CourseValidator.validateBodyOnStatusUpdate, CourseController.updateStatus)

// COURSE CATEGORIES
router.route('/categories')
    .patch(CourseCategoryValidator.validateBodyOnCreate, CourseCategoryController.createCategory)
    .get(CourseCategoryController.fetchCategories)

router.route('/categories/:id')
    .patch(CourseCategoryValidator.validateBodyOnUpdate, CourseCategoryController.updateCategory)
    .delete(CourseCategoryController.deleteCategory);

router.route('/categories/:id/subcategories')
    .get(CourseCategoryController.fetchSubcategories);

export default router;
