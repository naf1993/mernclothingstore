import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

const clientUrl = process.env.FRONTEND_URL

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  (req, res) => {
    console.log('req.user:', req.user);  // Log the user object to see if it's populated
    
    if (!req.user) {
      return res.status(401).send('User not authenticated');
    }
    const token = req.user.generateJWT();
    console.log('this is token')
    console.log(token)
    res.cookie("x-auth-cookie", token, {
      httpOnly: true,  // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Set to true if in production (HTTPS)
      sameSite: 'None',  // If using cross-site cookies (e.g., if frontend and backend are on different domains)
    });
    res.redirect(clientUrl);
    console.log('cookie sent')
  }
);

router.get("/auth/logout/google", (req, res) => {
  req.logout();
  res.redirect(clientUrl);
});

router.get("/auth/logout/email", function (req, res) {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out succesfully" });
});

export default router;
