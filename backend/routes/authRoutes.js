import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

const clientUrl = process.env.FRONTEND_URL;
//const clientUrl = "http://localhost:3000"

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  (req, res) => {
    console.log('req.user:', req.user);
    
    if (!req.user) {
      return res.status(401).send('User not authenticated');
    }
    const token = req.user.generateJWT();
    console.log('this is token:', token);
    const redirectUrl = `${clientUrl}/auth-google?token=${token}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }
);


router.get("/auth/logout/google", (req, res) => {
  req.logout();
  res.clearCookie("x-auth-cookie");
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
