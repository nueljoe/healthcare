import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import pagination from '../../middlewares/pagination';
import CourseCategoryValidator from '../../validators/courseCategory';
import CourseValidator from '../../validators/course';
import CourseModuleValidator from '../../validators/courseModule';
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
    .patch(authenticate, CourseValidator.validateBodyOnStatusUpdate, CourseController.updateStatus);

// COURSE MODULES
router.route('/:slug/modules')
    .post(authenticate, CourseModuleValidator.validateBodyOnCreate, CourseController.createCourseModule)
    .get(pagination, CourseController.fetchCourseModules);

router.route('/:slug/modules/:moduleId')
    .get(pagination, CourseController.fetchCourseModule)
    .patch(authenticate, CourseModuleValidator.validateBodyOnUpdate, CourseController.updateCourseModule)
    .delete(authenticate, CourseController.deleteCourseModule);

router.route('/:slug/modules/:moduleId/status')
    .patch(authenticate, CourseModuleValidator.validateBodyOnStatusUpdate, CourseController.updateModuleStatus);

router.route('/:slug/modules/:moduleId/position')
    .patch(authenticate, CourseModuleValidator.validateBodyOnPositionUpdate, CourseController.updateModulePosition);

// COURSE CATEGORIES
router.route('/categories')
    .patch(CourseCategoryValidator.validateBodyOnCreate, CourseCategoryController.createCategory)
    .get(CourseCategoryController.fetchCategories);

router.route('/categories/:id')
    .patch(CourseCategoryValidator.validateBodyOnUpdate, CourseCategoryController.updateCategory)
    .delete(CourseCategoryController.deleteCategory);

router.route('/categories/:id/subcategories')
    .get(CourseCategoryController.fetchSubcategories);

export default router;
