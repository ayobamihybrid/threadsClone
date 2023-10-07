import express from 'express';
import {
  loginUser,
  registerUser,
  loadUser,
  getAllUsers,
  followUnfollowUsers,
  getSingleUser,
  getNotifications,
  editProfile,
} from '../controllers/userController.js';
import { isUserAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/load-user', isUserAuthenticated, loadUser);

router.get('/all-users', isUserAuthenticated, getAllUsers);

router.get('/single-user/:userId', isUserAuthenticated, getSingleUser);

router.put('/follow-unfollow', isUserAuthenticated, followUnfollowUsers);

router.get('/notifications', isUserAuthenticated, getNotifications);

router.put('/edit-profile', isUserAuthenticated, editProfile);

export default router;
