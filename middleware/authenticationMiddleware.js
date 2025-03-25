import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
        }

        req.user = user;
        next();
    });
}

export default authenticateToken;
