/* jshint esversion: 11 */

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Verify Token Middleware
const authenticateToken = (request, response, next) => {
    const token = request.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return response.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        request.user = verified; // Add user data to request
        next();
    } catch (error) {
        response.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = authenticateToken;