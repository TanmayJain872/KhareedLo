/* jshint esversion: 11 */

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { registerUser } = require("middleware/user/create-user-service");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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
        response.status(500).json({ error: "Error registering user." });
    }
});

// User Login
router.post("/login", async (request, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ error: "Username and password are required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return response.status(400).json({ error: "Invalid username or password." });
        }

        const passwordMatches = await bcrypt.compare(password, user?.password);
        if (!passwordMatches) {
            return response.status(400).json({ error: "Invalid username or password." });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "3h" });
        response.status(200).json({ token, message: "Login successful." });
    } catch (error) {
        response.status(500).json({ error: "Error logging in." });
    }
});


module.exports = router;
