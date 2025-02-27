import express from 'express';
import passport from '../utils/passport';

import {
  createServer,
  getServers,
  getServerById,
  updateServer,
  deleteServer,
  joinServer,
} from '../controllers/serversController';
const router = express.Router();

/* POST create server */
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createServer,
);

/* GET get all servers */
router.get('/', passport.authenticate('jwt', { session: false }), getServers);

/* GET get server by id */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getServerById,
);

/* PUT update server */
router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  updateServer,
);

/* DELETE delete server */
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  deleteServer,
);

router.post(
  '/join/:id',
  passport.authenticate('jwt', { session: false }),
  joinServer,
);
export default router;
