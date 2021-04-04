const userController = require("../../controllers/user");
const User = require("../../models/user");
const mongoose = require("mongoose");
const crypto = require("crypto");
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
    await User.findOneAndDelete({ username: "testtest" });
    await User.findOneAndDelete({ username: "test_test" });
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

describe("test user controller", () => {
    it("register", async () => {
        const user = {
            username: "testtest",
            name: "test",
            email: process.env.EMAIL,
            password: "testTEST12!@",
        };
        const req = mockRequest({ body: user });
        const res = mockResponse();

        const response = await userController.register(req, res);
        expect(response.status).toHaveBeenCalledWith(201);
    });

    it("confirm", async () => {
        const verifyCode = crypto.randomBytes(128).toString("base64");

        const user = new User({
            username: "test_test",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode,
            verified: false,
            password: "testing",
            createdAt: Date.now(),
        });
        await user.save();

        const req = mockRequest({ params: { verifyCode } });
        const res = mockResponse();

        const response = await userController.confirm(req, res);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({
            message: "User confirmed",
        });
    });

    it("add pending", async () => {
        const saveUser1 = new User({
            username: "addPending1",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser1.save();
        const saveUser2 = new User({
            username: "addPending2",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser2.save();

        var user1 = await User.findOne({ username: "addPending1" });
        var user2 = await User.findOne({ username: "addPending2" });

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.addPending(req, res);

        user1 = await User.findOne({ username: "addPending1" });
        user2 = await User.findOne({ username: "addPending2" });

        expect(user1.pending[0].toString("base64")).toBe(
            user2._id.toString("base64")
        );
        expect(user2.requests[0].toString("base64")).toBe(
            user1._id.toString("base64")
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Pending added",
        });
    });

    it("remove pending", async () => {
        const saveUser1 = new User({
            username: "removePending1",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser1.save();
        const saveUser2 = new User({
            username: "removePending2",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser2.save();

        var user1 = await User.findOne({ username: "removePending1" });
        var user2 = await User.findOne({ username: "removePending2" });

        user1 = await User.findOneAndUpdate(
            { _id: user1._id },
            { $push: { pending: user2._id } }
        );
        user2 = await User.findOneAndUpdate(
            { _id: user2._id },
            { $push: { requests: user1._id } }
        );

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.removePending(req, res);

        user1 = await User.findOne({ username: "removePending1" });
        user2 = await User.findOne({ username: "removePending2" });

        expect(user1.pending).toHaveLength(0);
        expect(user2.requests).toHaveLength(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Pending removed",
        });
    });

    it("add friend", async () => {
        const saveUser1 = new User({
            username: "addFriend1",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser1.save();
        const saveUser2 = new User({
            username: "addFriend2",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser2.save();

        var user1 = await User.findOne({ username: "addFriend1" });
        var user2 = await User.findOne({ username: "addFriend2" });

        user1 = await User.findOneAndUpdate(
            { _id: user1._id },
            { $push: { pending: user2._id } }
        );
        user2 = await User.findOneAndUpdate(
            { _id: user2._id },
            { $push: { requests: user1._id } }
        );

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.addFriend(req, res);

        user1 = await User.findOne({ username: "addFriend1" });
        user2 = await User.findOne({ username: "addFriend2" });

        expect(user1.friendList[0].toString("base64")).toBe(
            user2._id.toString("base64")
        );
        expect(user2.friendList[0].toString("base64")).toBe(
            user1._id.toString("base64")
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Friend added",
        });
    });

    it("add friend", async () => {
        const saveUser1 = new User({
            username: "removeFriend1",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser1.save();
        const saveUser2 = new User({
            username: "removeFriend2",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await saveUser2.save();

        var user1 = await User.findOne({ username: "removeFriend1" });
        var user2 = await User.findOne({ username: "removeFriend2" });

        user1 = await User.findOneAndUpdate(
            { _id: user1._id },
            { $push: { pending: user2._id } }
        );
        user2 = await User.findOneAndUpdate(
            { _id: user2._id },
            { $push: { requests: user1._id } }
        );

        const req = mockRequest({
            userId: user1._id,
            body: { friendId: user2._id },
        });
        const res = mockResponse();

        await userController.removeFriend(req, res);

        user1 = await User.findOne({ username: "removeFriend1" });
        user2 = await User.findOne({ username: "removeFriend2" });

        expect(user1.friendList).toHaveLength(0);
        expect(user2.friendList).toHaveLength(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Friend removed",
        });
    });
});
