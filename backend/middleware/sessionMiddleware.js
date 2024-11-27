import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

export const sessionMiddleware = (req, res, next) => {
    if (req.user) {
        req.sessionId = null; // Clear sessionId for logged-in users
        req.userId = req.user._id; // Add userId from authentication
      } else {
        // Generate a new sessionId if it doesn't exist in cookies (for anonymous users)
        if (!req.cookies.sessionId) {
          res.cookie('sessionId', uuidv4(), { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // 1 day expiry
        }
        req.userId = null; // No userId for anonymous users
        req.sessionId = req.cookies.sessionId; // Use the sessionId from cookies for anonymous users
      }
  next();
};
