import { prismaClient as prisma } from '../app';
import { issueJWT } from '../utils/issueJWT';
import { NextFunction, Response, Request } from 'express';
import registerSchema from '../schema/registerSchema';
import { User, Server } from '@prisma/client';
const debug = require('debug')('prism-api:server');

//* Create a new server
export const createServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const currentUser = req.user as User;
    const { name, description } = req.body;
    const server = await prisma.server.create({
      data: {
        ownerId: currentUser.id,
        userId: currentUser.id,
        name,
        description,
      },
    });
    return res
      .status(201)
      .json({ message: 'Server created successfully', server });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//* Get all servers that a user is in
export const getServers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const currentUser = req.user as User;
    const servers = await prisma.server.findMany({
      where: {
        OR: [
          {
            ownerId: currentUser.id,
          },
          {
            userId: currentUser.id,
          },
        ],
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return res.status(200).json({ servers });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//* Get a specific server by id
export const getServerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const server = await prisma.server.findUnique({
      where: {
        id: id,
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    return res.status(200).json({ server });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//* Update a server
export const updateServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUser = req.user as User;
    const { name, description, icon } = req.body;
    const updatedServer = await prisma.server.update({
      where: {
        id: id,
        ownerId: currentUser.id,
      },
      data: {
        name,
        description,
      },
    });

    if (!updatedServer) {
      return res.status(404).json({ message: 'Server not found' });
    }

    return res.status(200).json({ message: 'Server updated successfully' });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//*Delete a server
export const deleteServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUser = req.user as User;
    const server = await prisma.server.delete({
      where: {
        id: id,
        ownerId: currentUser.id,
      },
    });
    console.log(server);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    return res.status(200).json({ message: 'Server deleted successfully' });
  } catch (error) {
    debug(error);
    next(error);
  }
};
