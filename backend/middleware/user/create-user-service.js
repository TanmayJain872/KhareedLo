/* jshint esversion: 11 */

const bcrypt = require("bcryptjs");

const GetUserDataQuery = require("queries/user/get-user-data-query.js");
const CreateUserQuery = require("queries/user/create-user-query.js");

module.exports.registerUser = async ({ fullName, username, password, phoneNumber, emailId, createdBy }) => {
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
        console.log("🚀 ~ module.exports.registerUser= ~ userExists:", usernameAlreadyExists)
        if (usernameAlreadyExists) {
            return {
                message: "Username already exists. Please try again with a different username.",
                status: true,
                statusCode: 400,
                error: "BusinessValidationError"
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await CreateUserQuery.createUser({
            fullName,
            username,
            password: hashedPassword,
            // phoneNumber,
            emailId,
            createdBy,
        });
        return {
            message: "User registered successfully!",
            status: true,
            statusCode: 201,
            data: user
        };
    } 
    catch (error) {
        console.error("🚀 ~ module.exports.registerUser= ~ error:", error);
        return error;
    }

};
