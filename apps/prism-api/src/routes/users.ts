import express from 'express';
import passport from '../utils/passport';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/usersController';
import {
  requestFriendship,
  viewSentFriendRequests,
  viewReceivedFriendRequests,
  acceptFriendRequest,
  viewFriendsList,
  removeFriend,
} from '../controllers/usersFriendController';
const router = express.Router();

/* POST register user */
router.post('/register', registerUser);

/* POST login user */
router.post('/login', loginUser);

/* GET user profile */
router.get(
  '/session',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  },
);

/* POST logout user */
router.post('/logout', logoutUser);

//** Friend Management */

/* PUT add/remove friend(user) */
router.put(
  '/friend/send-request/:id',
  passport.authenticate('jwt', { session: false }),
  requestFriendship,
);

/* GET view pending friend requests */
router.get(
  '/friend/sent-pending-requests',
  passport.authenticate('jwt', { session: false }),
  viewSentFriendRequests,
);

/* GET view received friend requests */
router.get(
  '/friend/received-pending-requests',
  passport.authenticate('jwt', { session: false }),
  viewReceivedFriendRequests,
);

/* PATCH accept friend request */
router.patch(
  '/friend/accept/:id',
  passport.authenticate('jwt', { session: false }),
  acceptFriendRequest,
);

/* GET view friends list */
router.get(
  '/friends/',
  passport.authenticate('jwt', { session: false }),
  viewFriendsList,
);

/* DELETE remove friend(user) */
router.delete(
  '/friend/remove/:id',
  passport.authenticate('jwt', { session: false }),
  removeFriend,
);

export default router;
