import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from '../models/userModel.js'
import keys from "../config/keys.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

export const googleStrategy = new GoogleStrategy(
  {
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    proxy:true
  },
  async (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
      if (currentUser) {
        // already have this user
       
        done(null, currentUser);
      } else {
        // if not, create user in our db
        new User({
          googleId: profile.id,
          name: profile.displayName,
          provider: "google",
          email:profile.email
        })
          .save()
          .then((newUser) => {
         
            done(null, newUser);
          });
          
      }
    });
  }
);
