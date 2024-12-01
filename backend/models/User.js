/* jshint esversion: 11 */

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const autoIncrement = require("mongoose-auto-increment");

// autoIncrement.initialize(mongoose.connection);

const UserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.Number,
        required: false
    },
    externalUserId: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    fullName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    // phoneNumber: {
    //     type: mongoose.Schema.Types.Number,
    //     required: true,
    // },
    emailId: {
        type: mongoose.Schema.Types.String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    }
});

// UserSchema.plugin(autoIncrement.plugin, {
//     model: "User",
//     field: "id",
//     startAt: 1,
//     incrementBy: 1
// });
UserSchema.plugin(AutoIncrement, { inc_field: "userId", start_seq: 1, counter_name: "userCounter" });  

UserSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});
  

UserSchema.post("save", async (doc, next) => {
    const calculatedId = doc.userId + 1000;
    doc.externalUserId = `US-${calculatedId}`;
    doc.save()
        .then(() => next())
        .catch(error => {
            console.error("Failed to create External Product ID");
            next(error);
        });
});

module.exports = mongoose.model("User", UserSchema);
