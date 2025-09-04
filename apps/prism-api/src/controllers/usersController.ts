import bcrypt from 'bcryptjs';
import { prismaClient as prisma } from '../app';
import { issueJWT } from '../utils/issueJWT';
import { NextFunction, Response, Request } from 'express';
import registerSchema from '../schema/registerSchema';
import { User } from '@prisma/client';
import { log } from 'console';
import { asyncHandler } from '../middleware/async-handler';
import { badRequest, forbidden, notFound } from '../errors/app-error';
const debug = require('debug')('prism-api:server');

//* Get current user
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('req.user', req.user);
    const currentUser = req.user as User;
    return res.status(200).json({
      message: 'User fetched successfully',
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
      },
    });
  },
);

//* Sign up a new user
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (process.env.NODE_ENV === 'development') {
      return res.status(400).json({ error: 'Signup is currently disabled.' });
    }
    registerSchema.parse(req.body);
    const { email, password, username, name } = req.body;

    //Check if the user already exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email } }, { username: { equals: username } }],
      },
    });
    console.log('user', user);

    user && user.email === email
      ? badRequest('Email already exists')
      : user && user.username === username
        ? badRequest('Username already exists')
        : null;

    console.log('creating a new user');
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
          return badRequest('An error occurred while creating a user');
        }
      }
    });
  },
);

//* Login a user
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      throw notFound('User not found');
    }

    //user exists
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw badRequest('Invalid credentials');
    }

    const token = issueJWT(user);
    res.json({
      message: 'User logged in successfully',
      token: token.token,
      expiresIn: token.expires,
      user,
    });
  },
);

//* Find a user by username
export const findUserByUsername = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const username = req.params.username;
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw notFound('User not found');
    }

    res.status(200).json({ message: 'User found successfully', user });
  },
);

//* Update user
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const id = req.params.id;
    const currentUser = req.user as User;
    if (id !== currentUser.id) {
      throw forbidden('You are not authorized to update this user');
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: {
        ...req.body,
      },
    });
    res.status(200).json({ message: 'User updated successfully', user });
  },
);

//* Delete user
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = req.params.id;
      await prisma.user.delete({ where: { id } });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      debug(error);
      next(Error('An error occurred while deleting user'));
    }
  },
);

//* Logout user from application
export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      console.log('req.user', req.user);
      res.cookie('jwt', '', { maxAge: 1 });
      res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      debug(error);
      next(Error('An error occurred while logging out'));
    }
  },
);
