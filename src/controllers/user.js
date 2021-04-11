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
            { password: false, code: false }
        );

        res.status(200).json({ user });
    },

    async info(req, res) {
        const { userid } = req.headers;
        const user = await User.findOne(
            { _id: userid },
            {
                email: false,
                password: false,
                code: false,
                verified: false,
                friendList: false,
                requests: false,
                pending: false,
                createdAt: false,
            }
        );

        res.status(200).json(user);
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

    async addPending(user, friend, socket) {
        //* add friendId to pending status
        await User.findOneAndUpdate(
            { _id: user._id },
            {
                $push: {
                    pending: {
                        id: friend._id,
                        username: friend.username,
                    },
                },
            }
        );

        //* add userId to request status in friendUser
        await User.findOneAndUpdate(
            { _id: friend._id },
            {
                $push: {
                    requests: {
                        id: user._id,
                        username: user.username,
                    },
                },
            }
        );

        socket.emit("alert", `send friend request to ${friend.username}`);
    },

    async removePending(user, friend, socket) {
        //* remove friendId from pending status
        await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { requests: { id: friend._id } } }
        );

        //* remove userId from request status in friendUser
        await User.findOneAndUpdate(
            { _id: friend._id },
            { $pull: { pending: { id: user._id } } }
        );

        socket.emit("alert", `${friend.username}'s request declined`);
    },

    async addFriend(user, friend, socket) {
        //* add newFriend to user's friends
        await User.findOneAndUpdate(
            { _id: user._id },
            {
                $push: {
                    friendList: {
                        id: friend._id,
                        name: friend.name,
                        username: friend.username,
                    },
                },
                $pull: { requests: { id: friend._id } },
            }
        );

        //* add user to newFriend's friends
        await User.findOneAndUpdate(
            { _id: friend._id },
            {
                $push: {
                    friendList: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                    },
                },
                $pull: { pending: { id: user._id } },
            }
        );

        socket.emit("alert", `${friend.username} added to your friend list`);
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
