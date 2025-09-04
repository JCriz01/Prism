import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Defaults for local/dev; ensure JWT_SECRET is set in prod
const jwtSecret = process.env.JWT_SECRET || 'dev-insecure-secret';
const jwtExpires = process.env.JWT_EXPIRES || '1d'; // supports zeit/ms strings like '1d'

type JwtCustomClaims = {
  sub: string;
  iss: string;
  aud: string;
  // iat and exp are added by sign options
};

export type IssuedToken = {
  token: string; // raw token without Bearer prefix
  expiresIn: number; // seconds
};

export const issueJWT = (user: User): IssuedToken => {
  const issuer = process.env.JWT_ISSUER || 'prism-api';
  const audience = process.env.JWT_AUDIENCE || 'prism-webapp';

  const payload: JwtCustomClaims = {
    sub: user.id,
    iss: issuer,
    aud: audience,
  };

  const signedToken = jwt.sign(payload, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: jwtExpires,
  });

  // jsonwebtoken doesn't return exp seconds; parse from decode for convenience
  const decoded = jwt.decode(signedToken) as { exp?: number; iat?: number } | null;
  const expiresInSeconds = decoded?.exp && decoded?.iat ? decoded.exp - decoded.iat : 24 * 60 * 60;

  return {
    token: signedToken,
    expiresIn: expiresInSeconds,
  };
};
