/* jshint esversion: 11 */

const User = require('models/User.js');

module.exports.getUsersData = async ({ page = 1, limit = 10, username = "", userId = null }) => {
    try {

        let data, totalPages = 1, totalUsers = 1;
        
        if (userId) {
            data = await User.findById(userId);
        } else if (username) {
            data = await User.findOne({ username }).select("-_id");
        }
        else {
            const skip = (page - 1) * limit;
            data = await User.find()
                .select("-_id -password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalUsers = await User.countDocuments();
            totalPages = Math.ceil(totalUsers / limit);
        }

        return {
            data,
            currentPage: page,
            totalPages,
            totalUsers
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return error;
    }
};
