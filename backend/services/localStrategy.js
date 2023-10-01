import passport from "passport";
import { Strategy as PassportLocalStrategy } from "passport-local";
import User from '../models/userModel.js'
import bcrypt from "bcryptjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
      done(null, user);
  });
});

export const localStrategy = new PassportLocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email: email }).exec();
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return done(null, user);
      } else {
        return done("Incorrect email or password");
      }
    } catch (err) {
      return done(err);
    }
  }
  
);
