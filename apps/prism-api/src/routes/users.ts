import { NextFunction, Request, Response } from 'express';

import express from 'express';
import passport from '../utils/passport';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/usersController';
const router = express.Router();

/* GET users listing. */
router.post('/register', registerUser);

/* POST login user */
router.post('/login', loginUser);

/* POST logout user */
router.post('/logout', logoutUser);

export default router;
