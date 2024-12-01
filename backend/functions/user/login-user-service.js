/* jshint esversion: 11 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const GetUserDataQuery = require("queries/user/get-user-data-query.js");


module.exports.loginUser = async ({ username, password }) => {
    if (!username || !password) {
        return {
            message: "Username and password are required.",
            status: true,
            statusCode: 400,
            error: "BusinessValidationError"
        };
    }

    try {
        const queryResult = await GetUserDataQuery.getUsersData({
            username
        });
        const user = JSON.parse(JSON.stringify(queryResult?.data));
        if (!user) {
            return {
                message: "Invalid username.",
                status: true,
                statusCode: 400,
                error: "BusinessValidationError"
            };
        }
        const passwordMatches = await bcrypt.compare(password, user?.password);
        if (!passwordMatches) {
            return {
                message: "Invalid password.",
                status: true,
                statusCode: 400,
                error: "BusinessValidationError"
            };
        }
        const token = await jwt.sign({ id: user?._id, username: user?.username, password: user?.password }, JWT_SECRET, { expiresIn: "24h" });
        return {
            message: "Login Successful!",
            status: true,
            statusCode: 200,
            token,
            data: user
        };
    } catch (error) {
        console.error("🚀 ~ module.exports.registerUser= ~ error:", error);
        return error;
    }

};
