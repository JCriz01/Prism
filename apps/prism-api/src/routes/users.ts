import express from 'express';
import passport from '../utils/passport';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from '../controllers/usersController';
const router = express.Router();

/* POST register user */
router.post('/register', registerUser);

/* POST login user */
router.post('/login', loginUser);

/* POST logout user */
router.post('/logout', logoutUser);

/* PUT add/remove friend(user) */
router.put(
  '/friend/send/:id',
  passport.authenticate('jwt', { session: false }),
  sendFriendRequest,
);

/* PATCH accept friend request */
router.patch(
  '/friend/accept/:id',
  passport.authenticate('jwt', { session: false }),
  acceptFriendRequest,
);

/* DELETE remove friend(user) */
router.delete(
  '/friend/remove/:id',
  passport.authenticate('jwt', { session: false }),
  removeFriend,
);

export default router;
