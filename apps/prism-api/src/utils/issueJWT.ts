import { User } from '@prisma/client';
import exp from 'constants';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

export const issueJWT = (user: User) => {
  const id = user.id;
  const expiresIn = '1d';
  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, secret, { expiresIn: expiresIn });

  return {
    token: signedToken,
    expires: expiresIn,
  };
};
