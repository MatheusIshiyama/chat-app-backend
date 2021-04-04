const express = require("express");
const friendRoutes = express.Router();
const userController = require("../controllers/user");
const authenticate = require("../middlewares/authenticate");
const validateFriend = require("../middlewares/validateFriend");

friendRoutes.put("/pending/add", authenticate, validateFriend, (req, res) => {
    userController.addPending(req, res);
});

friendRoutes.put(
    "/pending/remove",
    authenticate,
    validateFriend,
    (req, res) => {
        userController.removePending(req, res);
    }
);

friendRoutes.put("/accept", authenticate, validateFriend, (req, res) => {
    userController.addFriend(req, res);
});

friendRoutes.put("/decline", authenticate, validateFriend, (req, res) => {
    userController.removeFriend(req, res);
});

module.exports = friendRoutes;
