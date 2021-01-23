import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import initiateTransaction from '../../middlewares/initiateTransaction';
import ForumDiscussionValidator from '../../validators/forumDiscussion';
import paginate from '../../middlewares/paginate';
import ForumDiscussionController from '../../controllers/ForumDiscussionController';

const router = Router();

router.route('/')
    .post(authenticate, ForumDiscussionValidator.validateBodyOnCreateDiscussion, ForumDiscussionController.createDiscussion)
    .get(paginate, ForumDiscussionController.fetchDiscussions);

router.get('/search', paginate, ForumDiscussionController.searchDiscussions)

router.route('/:id')
    .get(ForumDiscussionController.fetchDiscussion)
    .delete(authenticate, ForumDiscussionController.deleteDiscussion);;

router.route('/:id/comments')
    .post(authenticate, ForumDiscussionValidator.validateBodyOnCreateComment, initiateTransaction, ForumDiscussionController.addComment)
    .get(authenticate, ForumDiscussionController.fetchDiscussionComments);

router.delete('/:id/comments/:commentId', authenticate, ForumDiscussionController.deleteComment)


export default router;
