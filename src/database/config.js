const mongoose = require("mongoose");
require("dotenv").config();

const database = mongoose;

database
    .connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(() => console.log("[DATABASE] Connected"));

module.exports = database;
