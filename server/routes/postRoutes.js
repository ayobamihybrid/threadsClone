import express from 'express';
import { isUserAuthenticated } from '../middleware/auth.js';
import {
  createPost,
  getAllPosts,
  likeUnlikePost,
  handlePostReply,
  likeUnlikeReplies,
  addReplyToThreads,
  likeUnlikeThreadReply,
  addReplyToThreadsReply,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', isUserAuthenticated, createPost);

router.get('/get-all-posts', getAllPosts);

router.put('/like-unlike', isUserAuthenticated, likeUnlikePost);

router.put('/post-reply', isUserAuthenticated, handlePostReply);

router.put('/like-unlike-replies', isUserAuthenticated, likeUnlikeReplies);

router.put('/thread-reply', isUserAuthenticated, addReplyToThreads);

router.put(
  '/like-unlike-threadreplies',
  isUserAuthenticated,
  likeUnlikeThreadReply
);

router.put('/threads-reply-reply', isUserAuthenticated, addReplyToThreadsReply);

router.delete('/delete-post/:id', isUserAuthenticated, deletePost)

export default router;

