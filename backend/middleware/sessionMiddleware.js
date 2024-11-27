import { v4 as uuidv4 } from "uuid";

export const sessionMiddleware = (req, res, next) => {
    console.log("Session Middleware - User:", req.user);
    console.log("Session Middleware - SessionId:", req.sessionId);
    if (req.user) {
        // Logged-in user: clear sessionId
        req.sessionId = null; 
        req.userId = req.user._id; // Set the userId from the logged-in user
    } else {
        // For anonymous users, check if sessionId exists in cookies
        if (!req.cookies.sessionId) {
            // If no sessionId cookie exists, create one and set it in the response
            const sessionId = uuidv4();
            res.cookie('sessionId', sessionId, {
                maxAge: 24 * 60 * 60 * 1000, // Set cookie to expire in 1 day
                httpOnly: true,               // Ensures the cookie is not accessible by JavaScript (for security)
                sameSite: 'Strict',           // Helps with CSRF protection
            });
            req.sessionId = sessionId;  // Set the sessionId in the request object for further use
        } else {
            // If the sessionId exists in the cookies, use it
            req.sessionId = req.cookies.sessionId;
        }

        req.userId = null;  // No userId for anonymous users
    }
    next(); // Proceed to the next middleware or route handler
};
