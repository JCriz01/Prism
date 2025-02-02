import { NextFunction, Request, Response } from 'express';

import express from 'express';
import passport from '../utils/passport';
import { registerUser } from '../controllers/usersController';
const router = express.Router();

/* GET users listing. */
router.post('/register', registerUser);

export default router;
