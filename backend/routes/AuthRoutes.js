/* jshint esversion: 11 */

const express = require("express");

const { registerUser } = require("functions/user/create-user-service");
const { loginUser } = require("functions/user/login-user-service.js");

const router = express.Router();

// User Registration
router.post("/register", async (request, response) => {
    const { fullName, username, password, phoneNumber, emailId, createdBy } = request.body;

    try {
        const registeredUser = await registerUser({ fullName, username, password, phoneNumber, emailId, createdBy });
        if (registeredUser?.error) {
            return response.status(registeredUser?.statusCode).json(registeredUser);
        }
        return response
                    .status(registeredUser?.statusCode)
                    .json(registeredUser);
    } catch (error) {
        response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error registering user."
        });
    }
});

// User Login
router.post("/login", async (request, response) => {
    const { username, password } = request.body;
    try {
        const loggedInUser = await loginUser({ username, password });
        if (loggedInUser?.error) {
            return response.status(loggedInUser?.statusCode).json(loggedInUser);
        }
        return response
                    .status(loggedInUser?.statusCode)
                    .json({
                        message: loggedInUser?.message,
                        status: loggedInUser?.status,
                        statusCode: loggedInUser?.statusCode,
                        data: { ...loggedInUser?.data, token: loggedInUser?.token },
                    });
    } catch (error) {
        response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error Logging in"
        });
    }
});


module.exports = router;
