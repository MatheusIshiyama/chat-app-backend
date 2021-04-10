const database = require("../database/config");

const Chat = new database.Schema(
    {
        users: Array,
        messages: Array,
    },
    {
        versionKey: false,
    }
);

module.exports = new database.model("Chat", Chat);
