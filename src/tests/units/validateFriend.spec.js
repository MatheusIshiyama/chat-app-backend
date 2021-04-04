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

describe("test validateFriend", () => {
    it("undefined friendId", async () => {
        const req = mockRequest({ friendId: undefined });
        const res = mockResponse();

        const response = await validateFriend(req, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No friendId provided",
        });
    });

    it("invalid friendId", async () => {
        const req = mockRequest({ friendId: "test" });
        const res = mockResponse();

        const response = await validateFriend(req, res);
        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledWith({
            message: "User not found",
        });
    });

    it("valid friendId", async () => {
        const user = new User({
            username: "friendTest",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: "testing",
            createdAt: Date.now(),
        });
        await user.save();

        const reqUser = await User.findOne({ username: "friendTest" });
        const friendId = reqUser._id;

        const req = mockRequest({ friendId });
        const res = mockResponse();
        const next = jest.fn();

        await validateFriend(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
