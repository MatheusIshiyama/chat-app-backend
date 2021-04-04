const database = require("../database/config");

const User = new database.Schema(
    {
        username: String,
        name: String,
        email: String,
        verifyCode: String,
        verified: Boolean,
        password: String,
        createdAt: Date,
        friendList: Array,
        pending: Array,
        requests: Array,
    },
    {
        versionKey: false,
    }
);

module.exports = new database.model("User", User);
