import { prismaClient as prisma } from '../app';
import { issueJWT } from '../utils/issueJWT';
import { NextFunction, Response, Request } from 'express';
import registerSchema from '../schema/registerSchema';
import { User, Spectrum } from '@prisma/client';
const debug = require('debug')('prism-api:server');

//**Shared Server CRUD operations */
//* Get a specific server by id
export const getServerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const server = await prisma.spectrum.findUnique({
      where: {
        id: id,
      },
      include: {
        roles: true,
        channels: true,
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

//* Get all servers that a user is in
export const getServers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const currentUser = req.user as User;
    const servers = await prisma.spectrum.findMany({
      where: {
        OR: [
          {
            ownerId: currentUser.id,
          },
        ],
      },
      include: {
        members: true,
      },
    });
    return res.status(200).json({ servers });
  } catch (error) {
    debug(error);
    next(error);
  }
};

//**Server User CRUD operations */

//* Join server by name
export const joinServerByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { name } = req.params;
    const currentUser = req.user as User;
    const server = await prisma.spectrum.findFirst({
      where: { name: name },
    });
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    //found server, now add user to server
    await prisma.spectrum.update({
      where: { id: server.id },
      data: {},
    });
  } catch (error) {
    debug(error);
    next(error);
  }
};

export const joinServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUser = req.user as User;

    const server = await prisma.spectrum.findUnique({
      where: {
        id: id,
      },
      include: {},
    });
    console.log(server);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
  } catch (error) {
    debug(error);
    next(error);
  }
};

//**Server Admin CRUD operations */
//* Create a new server
export const createServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const currentUser = req.user as User;
    const { name, description } = req.body;
    const server = await prisma.spectrum.create({
      data: {
        ownerId: currentUser.id,
        name,
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
    const updatedServer = await prisma.spectrum.update({
      where: {
        id: id,
        ownerId: currentUser.id,
      },
      data: {
        name,
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
    const server = await prisma.spectrum.delete({
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
