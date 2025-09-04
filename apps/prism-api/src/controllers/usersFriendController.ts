import { prismaClient as prisma } from '../app';
import { NextFunction, Response, Request } from 'express';
import { User } from '@prisma/client';
import { log } from 'console';
import { asyncHandler } from '../middleware/async-handler';
import { badRequest, forbidden, notFound } from '../errors/app-error';
const debug = require('debug')('prism-api:server');

//** Friend Management **/
//*Send Friend Request
export const requestFriendship = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const addresseeId = req.params.id;

    if (currentUser.id === addresseeId) {
      //use custom badRequest error
      throw badRequest('You cannot send a friend request to yourself');
    }

    //check if the addressee exists
    const addressee = await prisma.user.findUnique({
      where: { id: addresseeId },
    });
    if (!addressee) {
      throw notFound('User not found');
    }

    //TODO: Check if the friend request already exists

    await prisma.friendship.create({
      data: {
        status: 'PENDING',
        requester: { connect: { id: currentUser.id } },
        addressee: { connect: { id: addresseeId } },
      },
      include: {
        requester: { select: { id: true, username: true } },
        addressee: { select: { id: true, username: true } },
      },
    });

    res.status(200).json({ message: 'Friend request sent successfully' });
  },
);

//* View PENDING Friend Requests
export const viewSentFriendRequests = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const pendingFriendRequests = await prisma.friendship.findMany({
      where: {
        requesterId: currentUser.id,
        status: 'PENDING',
      },
      include: {
        addressee: true,
      },
    });

    res.status(200).json({
      message: 'Pending friend requests fetched successfully',
      pendingFriendRequests,
    });
  },
);

//* View Received Friend Requests
export const viewReceivedFriendRequests = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const receivedFriendRequests = await prisma.friendship.findMany({
      where: {
        addresseeId: currentUser.id,
        status: 'PENDING',
      },
      include: {
        requester: true,
      },
    });

    res.status(200).json({
      message: 'Received friend requests fetched successfully',
      receivedFriendRequests,
    });
  },
);

//* Accept Friend Request
export const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const friendRequestId = req.params.id;

    if (currentUser.id === friendRequestId) {
      throw badRequest('You cannot accept a friend request to yourself');
    }

    //check if the friend request exists and if the status is PENDING
    const friendRequest = await prisma.friendship.findUnique({
      where: {
        requesterId_addresseeId: {
          requesterId: currentUser.id,
          addresseeId: friendRequestId,
        },
        status: 'PENDING',
      },
    });
    if (!friendRequest) {
      throw notFound('Friend request not found');
    }
    await prisma.friendship.update({
      where: {
        requesterId_addresseeId: {
          requesterId: currentUser.id,
          addresseeId: friendRequestId,
        },
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    res.status(200).json({ message: 'Friend request accepted successfully' });
  },
);

//* View Friends List

//TODO: refactor this to skip users that are ourselves
export const viewFriendsList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const friends = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: currentUser.id }, { addresseeId: currentUser.id }],
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    res
      .status(200)
      .json({ message: 'Friends list fetched successfully', friends });
  },
);

//* Remove Friend
//TODO: refactor this to check if the user is the requester or the addressee

export const removeFriend = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const friendId = req.params.id;

    await prisma.friendship.delete({
      where: {
        requesterId_addresseeId: {
          requesterId: currentUser.id,
          addresseeId: friendId,
        },
      },
    });

    res.status(200).json({ message: 'Friend removed successfully' });
  },
);
