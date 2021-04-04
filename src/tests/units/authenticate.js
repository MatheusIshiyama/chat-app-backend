const authenticate = require("../../services/authenticate");
const password = require("../../services/password");
const User = require("../../models/user");
const mongoose = require("mongoose");
require("dotenv").config();

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
    await User.findOneAndDelete({ username: "test_test" });
    await User.findOneAndDelete({ username: "testTesting" });
    await User.findOneAndDelete({ username: "test123test" });
    await mongoose.disconnect();
    console.log("[DEV_DATABASE] Disconnected");
});

describe("test authenticate", () => {
    it("undefined username", async () => {
        const res = mockResponse();

        const response = await authenticate(undefined, undefined, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No username provided",
        });
    });

    it("undefined password", async () => {
        const res = mockResponse();

        const response = await authenticate("test_test", undefined, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No password provided",
        });
    });

    it("invalid username", async () => {
        const res = mockResponse();

        const response = await authenticate("test_test", "testTEST12!@", res);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "Invalid username or password",
        });
    });

    it("invalid password", async () => {
        const res = mockResponse();
        const pwd = await password.hash("test");
        const user = new User({
            username: "test_test",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "testtest",
            verified: false,
            password: pwd,
            createdAt: Date.now(),
        });
        await user.save();

        const response = await authenticate("test_test", "testTEST12!@", res);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "Invalid username or password",
        });
    });

    it("valid username and password but not verified", async () => {
        const res = mockResponse();
        const pwd = await password.hash("test");
        const user = new User({
            username: "testTesting",
            name: "test_test",
            email: "testTEST@test.com",
            verifyCode: "testtest",
            verified: false,
            password: pwd,
            createdAt: Date.now(),
        });
        await user.save();

        const response = await authenticate("testTesting", "test", res);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "User unverified",
        });
    });

    it("valid username and password", async () => {
        const res = mockResponse();
        const pwd = await password.hash("test");
        const user = new User({
            username: "test123test",
            name: "test_test",
            email: "testTEST@test.com",
            verifyCode: "verified",
            verified: true,
            password: pwd,
            createdAt: Date.now(),
        });
        await user.save();

        const response = await authenticate("test123test", "test", res);
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalled();
    });
});
