/* jshint esversion: 11 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const GetUserDataQuery = require("queries/user/get-user-data-query.js");
const CreateUserQuery = require("queries/user/create-user-query.js");

module.exports.registerUser = async ({ fullName, username, password, phoneNumber, emailId, createdBy = 1 }) => {
    if (!username || !password) {
        return {
            message: "Username and password are required.",
            status: true,
            statusCode: 400,
            error: "BusinessValidationError"
        };
    }

    try {
        const userData = await GetUserDataQuery.getUsersData({
            username
        });
        const usernameAlreadyExists = Boolean(userData?.data)
        if (usernameAlreadyExists) {
            return {
                message: "Username already exists. Please try again with a different username.",
                status: true,
                statusCode: 400,
                error: "BusinessValidationError"
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryResult = await CreateUserQuery.createUser({
            fullName,
            username,
            password: hashedPassword,
            emailId,
            createdBy,
        });
        const user = JSON.parse(JSON.stringify(queryResult));
        const token = await jwt.sign({ id: user?._id, username: user?.username, password: user?.password }, JWT_SECRET, { expiresIn: "24h" });
        delete user["password"];
        delete user["_id"];
        return {
            message: "User registered successfully!",
            status: true,
            statusCode: 201,
            token: `Bearer ${token}`,
            data: user
        };
    } 
    catch (error) {
        console.error("🚀 ~ module.exports.registerUser= ~ error:", error);
        return error;
    }

};
