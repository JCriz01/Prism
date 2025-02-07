import bcrypt from 'bcryptjs';
import { prismaClient as prisma } from '../app';
import { issueJWT } from '../utils/issueJWT';
import { NextFunction, Response, Request } from 'express';
import registerSchema from '../schema/registerSchema';
import { User } from '@prisma/client';
const debug = require('debug')('prism-api:server');

//* Sign up a new user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.status(400).json({ error: 'Signup is currently disabled.' });
    }
    registerSchema.parse(req.body);
    const { email, password, username, dateOfBirth, name } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user) {
      throw Error('User already exists');
    }

    //creating a new user
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return next(err);
      } else {
        try {
          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hash,
              username,
            },
          });
          return res
            .status(201)
            .json({ message: 'User created successfully', user: newUser });
        } catch (err) {
          return next(err);
        }
      }
    });
  } catch (err) {
    debug(err);
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //user exists
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = issueJWT(user);
    res.json({
      message: 'User logged in successfully',
      token: token.token,
      expiresIn: token.expires,
      user,
    });
  } catch (error) {
    debug(error);
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    next(error);
  }
};
