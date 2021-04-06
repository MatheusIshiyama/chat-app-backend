const userController = require("../../controllers/user");
const User = require("../../models/user");
const mongoose = require("mongoose");
const generateCode = require("../../services/generateCode");
require("dotenv").config();

const mockRequest = (content) => {
    return content;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const newUser = async (title, verifyCode) => {
    let code, verified;
    if (!code) {
        code = "verified";
        verified = true;
    } else {
        code = verifyCode;
        verified = false;
    }
    await new User({
        username: title,
        name: title,
        email: `${title}@chatApp.com`,
        code,
        verified,
        password: title,
        createdAt: Date.now(),
    }).save();
};

const findUser = async (username) => {
    return await User.findOne({ username });
};

beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_DEV, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    });

    console.log("[DEV_DATABASE] Connected");
});

afterAll(async () => {
    await User.findOneAndDelete({ username: "registertest" });
    await User.findOneAndDelete({ username: "confirmTest" });
    await User.findOneAndDelete({ username: "addPending1" });
    await User.findOneAndDelete({ username: "addPending2" });
    await User.findOneAndDelete({ username: "removePending1" });
    await User.findOneAndDelete({ username: "removePending2" });
    await User.findOneAndDelete({ username: "addFriend1" });
    await User.findOneAndDelete({ username: "addFriend2" });
    await User.findOneAndDelete({ username: "removeFriend1" });
    await User.findOneAndDelete({ username: "removeFriend2" });
    await mongoose.disconnect();
    console.log("[DEV_DATABASE] Disconnected");
});

describe("Test user controller", () => {
    test("Test register function", async () => {
        const user = {
            username: "registertest",
            name: "registerTest",
            email: process.env.EMAIL,
            password: "registerTest",
        };
        const req = mockRequest({ body: user });
        const res = mockResponse();

        await userController.register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    test("Test confirm function", async () => {
        const code = generateCode();

        await newUser("confirmTest", code);

        const req = mockRequest({ body: { code } });
        const res = mockResponse();

        await userController.confirm(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User confirmed",
        });
    });

    test("Test addPending function", async () => {
        await newUser("addPending1");
        await newUser("addPending2");

        var user1 = await findUser("addPending1");
        var user2 = await findUser("addPending2");

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.addPending(req, res);

        user1 = await findUser("addPending1");
        user2 = await findUser("addPending2");

        expect(user1.pending[0].toString("base64")).toBe(
            user2._id.toString("base64")
        );
        expect(user2.requests[0].toString("base64")).toBe(
            user1._id.toString("base64")
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            error: "Pending added",
        });
    });

    test("Test removePending function", async () => {
        await newUser("removePending1");
        await newUser("removePending2");

        var user1 = await findUser("removePending1");
        var user2 = await findUser("removePending2");

        await User.findOneAndUpdate(
            { _id: user1._id },
            { $push: { pending: user2._id } }
        );
        await User.findOneAndUpdate(
            { _id: user2._id },
            { $push: { requests: user1._id } }
        );

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.removePending(req, res);

        var user1 = await findUser("removePending1");
        var user2 = await findUser("removePending2");

        expect(user1.pending).toHaveLength(0);
        expect(user2.requests).toHaveLength(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            error: "Pending removed",
        });
    });

    test("Test addFriend function", async () => {
        await newUser("addFriend1");
        await newUser("addFriend2");

        var user1 = await findUser("addFriend1");
        var user2 = await findUser("addFriend2");

        await User.findOneAndUpdate(
            { _id: user1._id },
            { $push: { pending: user2._id } }
        );
        await User.findOneAndUpdate(
            { _id: user2._id },
            { $push: { requests: user1._id } }
        );

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.addFriend(req, res);

        user1 = await findUser("addFriend1");
        user2 = await findUser("addFriend2");

        expect(user1.friendList[0].toString("base64")).toBe(
            user2._id.toString("base64")
        );
        expect(user2.friendList[0].toString("base64")).toBe(
            user1._id.toString("base64")
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            error: "Friend added",
        });
    });

    test("add friend", async () => {
        await newUser("removeFriend1");
        await newUser("removeFriend2");

        var user1 = await findUser("removeFriend1");
        var user2 = await findUser("removeFriend2");

        await User.findOneAndUpdate(
            { _id: user1._id },
            { $push: { pending: user2._id } }
        );
        await User.findOneAndUpdate(
            { _id: user2._id },
            { $push: { requests: user1._id } }
        );

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.removeFriend(req, res);

        user1 = await findUser("removeFriend1");
        user2 = await findUser("removeFriend2");

        expect(user1.friendList).toHaveLength(0);
        expect(user2.friendList).toHaveLength(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            error: "Friend removed",
        });
    });
});
