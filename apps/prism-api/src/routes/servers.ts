import express from 'express';
import passport from '../utils/passport';

import {
  createServer,
  getServers,
  getServerById,
  updateServer,
  deleteServer,
  joinServerByName,
  addMemberToServer,
  listServersUserIsMemberOf,
  updateSpectrumMember,
  leaveServer,
  createChannel,
  updateChannel,
  deleteChannel,
} from '../controllers/serversController';
const router = express.Router();

//** Server Admin Routes **//

/* POST create server */
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createServer,
);

/* DELETE delete server */
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  deleteServer,
);

/* PUT update server */
//TODO: this route changes actual server info, not just member info, fix later
router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  updateServer,
);

//** Server channel CRUD operations **//
//TODO: all of these routes do not check if the user is the owner of the server(anyone can create a channel)
/* POST create channel */
router.post(
  '/create-channel/:id',
  passport.authenticate('jwt', { session: false }),
  createChannel,
);

/* PUT update channel */
router.put(
  '/update-channel/:id',
  passport.authenticate('jwt', { session: false }),
  updateChannel,
);

/* DELETE delete channel */
router.delete(
  '/delete-channel/:id',
  passport.authenticate('jwt', { session: false }),
  deleteChannel,
);

//** Server Member Routes **//

/* GET get all servers */
router.get(
  '/list',
  passport.authenticate('jwt', { session: false }),
  listServersUserIsMemberOf,
);

/* GET get server by id */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getServerById,
);

router.post(
  '/join/:id',
  passport.authenticate('jwt', { session: false }),
  addMemberToServer,
);

router.post(
  'join/:name',
  passport.authenticate('jwt', { session: false }),
  joinServerByName,
);

/* PUT update member server info */
router.put(
  '/update-member/:id',
  passport.authenticate('jwt', { session: false }),
  updateSpectrumMember,
);

/* DELETE leave server */
router.delete(
  '/leave/:id',
  passport.authenticate('jwt', { session: false }),
  leaveServer,
);

export default router;
