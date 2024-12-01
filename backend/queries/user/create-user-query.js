/* jshint esversion: 11 */

const User = require("models/User.js");

module.exports.createUser = async ({ fullName, username, password, phoneNumber, emailId, createdBy = 1 }) => {
    const newUser = new User({
        fullName,
        username,
        password,
        // phoneNumber,
        emailId,
        createdBy,
        updatedBy: createdBy
    });

    try {
        await newUser.save();
        console.log("User created successfully:", newUser);
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        return error;
    }
};
