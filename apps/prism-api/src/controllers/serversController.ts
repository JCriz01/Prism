import { prismaClient as prisma } from '../app';
import { NextFunction, Response, Request } from 'express';
import { User } from '@prisma/client';
import { asyncHandler } from '../middleware/async-handler';
import { notFound, unprocessable } from '../errors/app-error';

//**Shared Server CRUD operations */
//* Get a specific server by id
export const getServerById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
      throw notFound('Server not found');
    }
    return res.status(200).json({ server });
  },
);

//* Get all servers that a user is in
export const getServers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const servers = await prisma.spectrum.findMany({
      where: {
        OR: [
          {
            ownerId: currentUser.id,
          },
          {
            members: {
              some: {
                userId: currentUser.id,
              },
            },
          },
        ],
      },
      include: {
        members: true,
        channels: true,
      },
    });
    return res.status(200).json({ servers });
  },
);

//**Server User CRUD operations */

//* Join server by name
export const joinServerByName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name } = req.params;
    const currentUser = req.user as User;
    const server = await prisma.spectrum.findFirst({
      where: { name: name },
    });
    if (!server) {
      throw notFound('Server not found');
    }
    //found server, now add user to server
    await prisma.spectrum.update({
      where: { id: server.id },
      data: {},
    });
    return res.status(200).json({ message: 'Successfully joined server' });
  },
);

export const joinServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
      throw notFound('Server not found');
    }
    return res.status(200).json({ message: 'Successfully joined server' });
  },
);

//** Server Admin CRUD operations **//
//* Create a new server
export const createServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const { name, description, iconUrl } = req.body;
    const server = await prisma.spectrum.create({
      data: {
        ownerId: currentUser.id,
        name,
        iconUrl,
        channels: {
          create: [
            {
              name: 'general',
              createdById: currentUser.id,
              type: 'SPECTRUM_TEXT',
            },
          ],
        },
        members: {
          create: {
            userId: currentUser.id,
            nickname: currentUser.username,
          },
        },
      },
      include: {
        channels: true,
      },
    });

    return res
      .status(201)
      .json({ message: 'Server created successfully', server });
  },
);

//* Update a server
export const updateServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const currentUser = req.user as User;
    const { name, description, iconUrl } = req.body;

    try {
      const updatedServer = await prisma.spectrum.update({
        where: {
          id: id,
          ownerId: currentUser.id,
        },
        data: {
          name,
          iconUrl,
        },
      });
      return res.status(200).json({
        message: 'Server updated successfully',
        server: updatedServer,
      });
    } catch (error: any) {
      // If the update fails due to record not found, throw not found error
      if (error.code === 'P2025') {
        throw notFound(
          'Server not found or you do not have permission to update it',
        );
      }
      throw error;
    }
  },
);

//*Delete a server
export const deleteServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const currentUser = req.user as User;

    try {
      const server = await prisma.spectrum.delete({
        where: {
          id: id,
          ownerId: currentUser.id,
        },
      });
      console.log(server);
      return res.status(200).json({ message: 'Server deleted successfully' });
    } catch (error: any) {
      // If the delete fails due to record not found, throw not found error
      if (error.code === 'P2025') {
        throw notFound(
          'Server not found or you do not have permission to delete it',
        );
      }
      throw unprocessable('Failed to delete server');
    }
  },
);

//** Server Member CRUD operations **//
//* Add a member to a server
export const addMemberToServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const currentUser = req.user as User;

    //Check if the server exists
    const server = await prisma.spectrum.findUnique({
      where: { id: id },
    });
    if (!server) {
      throw notFound('Server not found');
    }

    //Check if the user is already a member of the server
    const member = await prisma.spectrumMember.findUnique({
      where: { userId_spectrumId: { userId: currentUser.id, spectrumId: id } },
    });
    if (member) {
      throw unprocessable('User is already a member of the server');
    }

    //Add the user to the server
    const newMember = await prisma.spectrumMember.create({
      data: {
        userId: currentUser.id,
        spectrumId: id,
        nickname: currentUser.username,
      },
    });
    return res
      .status(200)
      .json({ message: 'User added to server', member: newMember });
  },
);

//* List servers a user is a member of
export const listServersUserIsMemberOf = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const currentUser = req.user as User;
    const servers = await prisma.spectrumMember.findMany({
      where: { userId: currentUser.id },
      include: {
        user: true,
        roles: {
          include: {
            role: true,
          },
        },
        spectrum: {
          include: {
            channels: true,
            roles: true,
            members: true,
            owner: true,
          },
        },
      },
    });
    return res.status(200).json({ servers });
  },
);

//* Update members server info
export const updateSpectrumMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const currentUser = req.user as User;
    const { nickname } = req.body;

    //Check if the server exists
    const server = await prisma.spectrum.findUnique({
      where: { id: id },
    });
    if (!server) {
      throw notFound('Server not found');
    }

    //Check if the user is a member of the server
    const member = await prisma.spectrumMember.findUnique({
      where: { userId_spectrumId: { userId: currentUser.id, spectrumId: id } },
    });
    if (!member) {
      throw notFound('User is not a member of the server');
    }

    //Update the members server info
    const updatedMember = await prisma.spectrumMember.update({
      where: { userId_spectrumId: { userId: currentUser.id, spectrumId: id } },
      data: { nickname },
    });
    return res
      .status(200)
      .json({ message: 'Member server info updated', member: updatedMember });
  },
);

//* Leave a server
export const leaveServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const currentUser = req.user as User;

    //Check if the server exists
    const server = await prisma.spectrum.findUnique({
      where: { id: id },
    });
    if (!server) {
      throw notFound('Server not found');
    }

    //Check if the user is a member of the server
    const member = await prisma.spectrumMember.findUnique({
      where: { userId_spectrumId: { userId: currentUser.id, spectrumId: id } },
    });
    if (!member) {
      throw notFound('User is not a member of the server');
    }

    //Leave the server
    const updatedMember = await prisma.spectrumMember.delete({
      where: { userId_spectrumId: { userId: currentUser.id, spectrumId: id } },
    });
    return res
      .status(200)
      .json({ message: 'User left server', member: updatedMember });
  },
);

//** Server channel CRUD operations **//
//* Creating a new channel
export const createChannel = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const serverId = req.params.id;
    const currentUser = req.user as User;

    const { channelId, channelType, channelName } = req.body;

    //Check if the server exists
    const server = await prisma.spectrum.findUnique({
      where: { id: serverId },
    });
    if (!server) {
      throw unprocessable('Unable to create channel, server not found');
    }

    await prisma.channel.create({
      data: {
        spectrumId: serverId,
        createdById: currentUser.id,
        parentId: channelId || null,
        type: channelType,
        name: channelName,
      },
    });
    return res.status(200).json({ message: 'Channel created successfully' });
  },
);

//* Updating a channel
export const updateChannel = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    //const { channelId, channelType, channelName } = req.body;

    await prisma.channel.update({
      where: { id: id },
      data: {
        ...req.body,
      },
    });
  },
);

//* Deleting a channel
export const deleteChannel = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    await prisma.channel.delete({
      where: { id: id },
    });
    return res.status(200).json({ message: 'Channel deleted successfully' });
  },
);
