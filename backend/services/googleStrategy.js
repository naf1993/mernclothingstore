import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../models/userModel.js";

const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback';


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
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackUrl,
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
