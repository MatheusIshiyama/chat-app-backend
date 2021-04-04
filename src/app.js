const express = require("express");

//* express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* routes
app.use("/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));

module.exports = app;
