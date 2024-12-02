/* jshint esversion: 11 */

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Verify Token Middleware
const authenticateToken = async (request, response, next) => {
    const token = request.headers.authorization.split(" ")[1];
    if (!token) {
        return response.status(401).json({
            message: "Access Denied. No token provided.",
            status: false,
            statusCode: 401,
            error: "Forbidden"
        });
    }
    try {
        const authenticated = jwt.verify(token, JWT_SECRET);
            request.user = authenticated;
            next();
    } catch (error) {
        response.status(500).send({
            message: "Token verification failed!",
            status: true,
            statusCode: 500,
            error: "InternalServerError"
        });
    }
};

module.exports = authenticateToken;