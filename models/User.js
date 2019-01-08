const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    access: {
        type: String,
        enum: ["USER", "STOREOWNER", "ADMIN"],
        default: "USER"
    }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
