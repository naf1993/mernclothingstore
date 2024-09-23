import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../models/userModel.js";
import keys from '../config/keys.js'

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  }).catch(err => done(err, null));
});

export const googleStrategy = new GoogleStrategy(
  {
    clientID: keys.google.GOOGLE_CLIENT_ID,
    clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
    callbackURL: keys.google.GOOGLE_CALLBACK_URL,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const currentUser = await User.findOne({ googleId: profile.id });
      if (currentUser) {
        // User already exists
        done(null, currentUser);
      } else {
        // Create a new user
        const newUser = await new User({
          googleId: profile.id,
          name: profile.displayName,
          provider: "google",
          email: profile.email,
        }).save();
        done(null, newUser);
      }
    } catch (err) {
      done(err, null);
    }
  }
);
