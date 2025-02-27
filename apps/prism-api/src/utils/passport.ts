import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
var debug = require('debug')('prism-api:server');
import { prismaClient as prisma } from '../app';

//JWT Strategy for passport js
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret',
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    debug('running jwt strategy');
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.sub,
        },
      });
      console.log('user is: ', user);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

export default passport;
