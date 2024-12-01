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
        return response.status(registeredUser.statusCode).json(registeredUser);
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
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
        console.log("🚀 ~ router.post ~ loggedInUser:", loggedInUser)
        return response
                    .status(loggedInUser?.statusCode)
                    .cookie("token", "Bearer " + loggedInUser?.token, {
                        path: "/api/products",
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
        response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error Logging in"
        });
    }
});


router.post("/logout", async (request, response) => {
    try {
        const { username } = request.body;
        console.log("🚀 ~ router.post ~ username:", username)
        response.status(200).cookie("token", "", {
            httpOnly: true,
            expires: new Date(0), // Set the expiration date to the past
        }).json({
            message: "Successfully logged out!",
            status: true,
            statusCode: 200,
            data: true
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Error in logging out",
            status: false,
            statusCode: 500,
            error: "InternalServerError"
        });
    }
});


module.exports = router;
