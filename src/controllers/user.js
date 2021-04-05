const crypto = require("crypto");
const User = require("../models/user");
const sendMail = require("../services/sendMail");
const password = require("../services/password");

const UserController = {
    async register(req, res) {
        const body = req.body;
        const hashPassword = password.hash(body.password);
        const verifyCode = crypto.randomBytes(128).toString("base64");
        const newUser = new User({
            username: body.username.toLowerCase(),
            name: body.name,
            email: body.email,
            verifyCode,
            verified: false,
            password: hashPassword,
            createdAt: Date.now(),
            friendList: [],
        });
        await newUser.save();

        const user = await User.findOne(
            { username: body.username },
            { _id: false, password: false }
        );

        await sendMail(body.email, verifyCode, "Confirm register");

        return res.status(201).json({ user });
    },

    async confirm(req, res) {
        const { verifyCode } = req.params;

        await User.findOneAndUpdate(
            { verifyCode },
            { verifyCode: "verified", verified: true }
        );

        return res.status(200).json({ error: "User confirmed" });
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
