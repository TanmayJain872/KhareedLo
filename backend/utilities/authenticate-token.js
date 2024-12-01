/* jshint esversion: 11 */

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Verify Token Middleware
const authenticateToken = async (request, response, next) => {
    console.log("🚀 ~ authenticateToken ~ request.cookies:", request.cookies)
    const bearerToken = request.cookies?.token;
    // Check if bearer is undefined
    if (typeof bearerToken !== "undefined") {
        // Split at the space
        const [ typeOfToken, token ] = bearerToken.split(" ");
        if (typeOfToken === "Bearer" && typeof token !== "undefined") {
            try {
                const authenticated = jwt.verify(token, JWT_SECRET);
                request.user = authenticated;
                next();
            } catch (error) {
                console.log(error);
                response.status(500).send({
                    message: "Token verification failed!",
                    status: true,
                    statusCode: 500,
                    error: "InternalServerError"
                });
            }
        }
    } else {
        // Forbidden
        console.log("Forbidden");
        response.status(403).send({
            error: "BusinessValidationError",
            status: false,
            statusCode: 403,
            message: "Client is forbidden to access this resource!"
        });
    }
};

module.exports = authenticateToken;