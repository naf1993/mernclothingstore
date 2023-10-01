import passport from 'passport';
import { Strategy as JwtStrategy} from 'passport-jwt';
import { ExtractJwt as ExtractJWT } from 'passport-jwt';
import User from '../models/userModel.js'
import keys from '../config/keys.js'

const secretOrKey = keys.jwt.secret

export const jwtStrategy =  new JwtStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  },
 
);


