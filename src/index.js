const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const server = http.Server(app);
const socket = socketIo(server, { cors: { origin: "*" } });
const socketAuth = require("./services/socketAuth");
const userController = require("./controllers/user");
const chatController = require("./controllers/chat");
const User = require("./models/user");
const Chat = require("./models/chat");
require("dotenv").config();

socket.use(socketAuth);

socket.on("connection", async (socket) => {
    const user = socket.user;
    let chatID = undefined;

    setInterval(async () => {
        const userInfo = await User.findOne({ _id: user._id });
        socket.emit("friendsRequests", userInfo.requests);
        socket.emit("friendList", userInfo.friendList);
    }, 3000);

    setInterval(async () => {
        let chatLastMessages = [];
        const chats = await Chat.find({ users: user._id }, { _id: false });
        chats.map((chat) => {
            let findId = chat.users.filter((users) => {
                return users != user._id.toString();
            })[0];
            if (findId) {
                const chatInfo = {
                    id: findId,
                    lastMessage: chat.messages.slice(-1)[0].message,
                };
                chatLastMessages.push(chatInfo);
            }
        });
        socket.emit("chatLastMessages", chatLastMessages);
    }, 2000);

    setInterval(async () => {
        if (chatID) {
            const chatInfo = await Chat.findOne({ _id: chatID });
            socket.emit("chatMessages", chatInfo.messages);
        }
    }, 500);

    socket.on("sendFriendRequest", async (friendUsername) => {
        const username = friendUsername.toLowerCase();

        if (user.username === username) {
            socket.emit("alert", "error to add yourself");
        }

        const friend = await User.findOne({ username });

        if (!friend) {
            socket.emit("alert", "user not found");
        }

        if (!friend.verified) {
            socket.emit("alert", "user's not verified");
        }

        userController.addPending(user, friend, socket);
    });

    socket.on("declineFriendRequest", async (friendUsername) => {
        const username = friendUsername.toLowerCase();

        const friend = await User.findOne({ username });

        if (!friend) {
            socket.emit("alert", "user not found");
        }

        userController.removePending(user, friend, socket);
    });

    socket.on("acceptFriend", async (friendUsername) => {
        const username = friendUsername.toLowerCase();

        const friend = await User.findOne({ username });

        if (!friend) {
            socket.emit("alert", "user not found");
        }

        userController.addFriend(user, friend, socket);
    });

    socket.on("chat", async (friendUsername) => {
        const username = friendUsername.toLowerCase();

        const friend = await User.findOne({ username });

        if (!friend) {
            socket.emit("alert", "user not found");
        }

        const chatExists = await Chat.findOne({
            users: { $all: [user._id, friend._id] },
        });

        if (!chatExists) {
            await new Chat({
                users: [user._id, friend._id],
            }).save();
        }

        const chat = await Chat.findOne({
            users: { $all: [user._id, friend._id] },
        });

        chatID = chat._id;

        socket.emit("chatId", {
            id: chat._id,
            friend: friend.name,
        });
    });

    socket.on("newMessage", async (chat) => {
        await Chat.findOneAndUpdate(
            { _id: chat.id },
            { $push: { messages: { by: user._id, message: chat.message } } }
        );
    });
});

server.listen(process.env.PORT, () => console.log("[SERVER] Running"));
