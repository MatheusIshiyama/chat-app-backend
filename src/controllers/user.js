const User = require("../models/user");
const sendMail = require("../services/sendMail");
const password = require("../services/password");
const authenticate = require("../services/authenticate");
const generateCode = require("../services/generateCode");

const UserController = {
    async user(req, res) {
        const { userId } = req;
        const user = await User.findOne(
            { _id: userId },
            { _id: false, password: false, code: false }
        );

        res.status(200).json({ user });
    },

    async register(req, res) {
        const body = req.body;
        const hashPassword = password.hash(body.password);
        const username = body.username.toLowerCase();
        const code = generateCode();
        const newUser = new User({
            username,
            name: body.name,
            email: body.email,
            code,
            verified: false,
            password: hashPassword,
            createdAt: Date.now(),
        });
        await newUser.save();

        await sendMail(body.email, code, "Confirm register");

        return await authenticate(username, body.password, res);
    },

    async confirm(req, res) {
        const { username, code } = req.body;

        let user = await User.findOne({ username, code });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user = await User.findOneAndUpdate(
            { username },
            { code: "verified", verified: true },
            { new: true }
        );

        return res.status(200).json({ message: "User confirmed", user });
    },

    async addPending(req, res) {
        const userId = req.userId;
        const newPendingId = req.body.friendId;

        //* add friendId to pending status
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { pending: newPendingId } }
        );

        //* add userId to request status in friendUser
        await User.findOneAndUpdate(
            { _id: newPendingId },
            { $push: { requests: userId } }
        );

        return res.status(200).json({ error: "Pending added" });
    },

    async removePending(req, res) {
        const userId = req.userId;
        const removePendingId = req.body.friendId;

        //* remove friendId from pending status
        await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { pending: removePendingId } }
        );

        //* remove userId from request status in friendUser
        await User.findOneAndUpdate(
            { _id: removePendingId },
            { $pull: { requests: userId } }
        );

        return res.status(200).json({ error: "Pending removed" });
    },

    async addFriend(req, res) {
        const userId = req.userId;
        const newFriendId = req.body.friendId;

        //* add newFriend to user's friends
        await User.findOneAndUpdate(
            { _id: userId },
            {
                $push: { friendList: newFriendId },
                $pull: { requests: newFriendId },
            }
        );

        //* add user to newFriend's friends
        await User.findOneAndUpdate(
            { _id: newFriendId },
            {
                $push: { friendList: userId },
                $pull: { pending: userId },
            }
        );

        return res.status(200).json({ error: "Friend added" });
    },

    async removeFriend(req, res) {
        const userId = req.userId;
        const removeFriendId = req.body.friendId;

        //* remove friend from user's friends
        await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { friendList: removeFriendId } }
        );

        //* remove user from friends's friends
        await User.findOneAndUpdate(
            { _id: removeFriendId },
            { $pull: { friendList: userId } }
        );

        return res.status(200).json({ error: "Friend removed" });
    },
};

module.exports = UserController;
