/* jshint esversion: 11 */

const express = require("express");

const { registerUser } = require("middleware/user/create-user-service");
const { loginUser } = require("middleware/user/login-user-service.js");

const router = express.Router();

// User Registration
router.post("/register", async (request, response) => {
    const { fullName, username, password, phoneNumber, emailId, createdBy } = request.body;

    try {
        const registeredUser = await registerUser({ fullName, username, password, phoneNumber, emailId, createdBy });
        if (registeredUser?.error) {
            return response.status(registeredUser?.statusCode).json(registeredUser);
        }
        return response.status(registeredUser.statusCode).json(registeredUser);
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error)
        response.status(500).json({ error: "Error registering user." });
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
                    .cookie("token", "Bearer " + loggedInUser?.token, {
                        path: "/api",
                        httpOnly: true,
                        maxAge: 24 * 3600 * 1000
                    })
                    .json({
                        message: loggedInUser?.message,
                        status: loggedInUser?.status,
                        statusCode: loggedInUser?.statusCode,
                        data: loggedInUser?.data,
                    });
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error)
        response.status(500).json({ error: "Error logging in." });
    }
});


module.exports = router;
