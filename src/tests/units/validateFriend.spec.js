const validateFriend = require("../../middlewares/validateFriend");
const User = require("../../models/user");
const mongoose = require("mongoose");
require("dotenv").config();

const mockRequest = (content) => {
    return { body: content };
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
    await User.findOneAndDelete({ username: "friendTest" });
    await mongoose.disconnect();
    console.log("[DEV_DATABASE] Disconnected");
});

describe("Test validateFriend middleware", () => {
    it("FriendId undefined", async () => {
        const req = mockRequest({ friendId: undefined });
        const res = mockResponse();

        await validateFriend(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No friendId provided",
        });
    });

    it("Invalid friendId", async () => {
        const req = mockRequest({ friendId: "test" });
        const res = mockResponse();

        await validateFriend(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "User not found",
        });
    });

    it("Valid friendId but not verified", async () => {
        await new User({
            username: "friendTest1",
            name: "friendTest1",
            email: "friendTest@chatApp.com",
            verifyCode: "verified",
            verified: false,
            password: "testing",
            createdAt: Date.now(),
        }).save();

        const reqUser = await User.findOne({ username: "friendTest1" });
        const friendId = reqUser._id;

        const req = mockRequest({ friendId });
        const res = mockResponse();

        await validateFriend(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "User unverified",
        });
    });

    it("Valid friendId and verified", async () => {
        await new User({
            username: "friendTest2",
            name: "friendTest2",
            email: "friendTest@chatApp.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        }).save();

        const reqUser = await User.findOne({ username: "friendTest2" });
        const friendId = reqUser._id;

        const req = mockRequest({ friendId });
        const res = mockResponse();
        const next = jest.fn();

        await validateFriend(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
