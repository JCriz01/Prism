import bcrypt from 'bcryptjs';
import { prismaClient as prisma } from '../app';
import { issueJWT } from '../utils/issueJWT';
import { NextFunction, Response, Request } from 'express';
import registerSchema from '../schema/registerSchema';
import { User } from '@prisma/client';
import { log } from 'console';
const debug = require('debug')('prism-api:server');

//* Sign up a new user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    console.log('signup route hit');
    if (process.env.NODE_ENV === 'development') {
      return res.status(400).json({ error: 'Signup is currently disabled.' });
    }
    console.log(req.body);
    registerSchema.parse(req.body);
    const { email, password, username, name } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email } }, { username: { equals: username } }],
      },
    });
    console.log('user', user);

    user && user.email === email
      ? next(Error('Email already exists'))
      : user && user.username === username
        ? next(Error('Username already exists'))
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
          return next(err);
        }
      }
    });
  } catch (err) {
    debug(err);
    next(Error('An error occurred while creating a new user'));
  }
};

//* Login a user
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
      throw Error('User not found');
    }

    //user exists
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw Error('Invalid credentials');
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

//* Logout user from application
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    console.log('req.user', req.user);
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    debug(error);
    next(Error('An error occurred while logging out'));
  }
};

//*Send Friend Request
//TODO: Add a check to see if the user has already sent a friend request
export const sendFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = req.params.id;
    console.log('current user: ', req.user);
    const currentUser = req.user as User;
    id === currentUser.id &&
      res
        .status(400)
        .json({ message: 'Cannot send a friend request to yourself' });

    //check if there is an existing friend request
    const existingRequest = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            receiverId: id,
          },
          {
            senderId: id,
            receiverId: currentUser.id,
          },
        ],
      },
    });

    if (existingRequest) {
      throw Error('Friend request already exists');
    }

    //Proceed to send friend request

    await prisma.friend.create({
      data: {
        senderId: currentUser.id,
        receiverId: id,
        status: 'PENDING',
      },
    });
    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//*Accept Friend Request
export const acceptFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = req.params.id;
    const currentUser = req.user as User;

    id === currentUser.id &&
      res
        .status(400)
        .json({ message: 'Cannot accept friend request to yourself.' });

    //check if the friend request exists
    const pendingRequest = await prisma.friend.findFirst({
      where: {
        senderId: id,
        receiverId: currentUser.id,
        status: 'PENDING',
      },
    });

    if (!pendingRequest) {
      throw Error('Friend request does not exist');
    }

    //Accept the friend request
    await prisma.friend.update({
      where: {
        id: pendingRequest.id,
      },
      data: { status: 'ACCEPTED' },
    });
    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//*Remove Friend
//TODO: add a check to see if the user is not friends with the requested user.
export const removeFriend = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = req.params.id;
    const currentUser = req.user as User;

    //Checking if the user is friends
    const validFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            receiverId: id,
            status: 'ACCEPTED',
          },
          {
            senderId: id,
            receiverId: currentUser.id,
            status: 'ACCEPTED',
          },
        ],
      },
    });

    if (!validFriend) {
      throw Error('User is not a friend');
    }

    await prisma.friend.delete({
      where: {
        id: validFriend.id,
      },
    });
    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    debug(error);
    next(error);
  }
};
