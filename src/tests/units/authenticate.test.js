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
    await User.findOneAndDelete({ username: "authenticateTest1" });
    await User.findOneAndDelete({ username: "authenticateTest2" });
    await User.findOneAndDelete({ username: "authenticateTest3" });
    await User.findOneAndDelete({ username: "authenticateTest4" });
    await mongoose.disconnect();
    console.log("[DEV_DATABASE] Disconnected");
});

describe("Test authenticate service", () => {
    test("Username undefined", async () => {
        const res = mockResponse();

        await authenticate(undefined, undefined, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No username provided",
        });
    });

    test("Password undefined", async () => {
        const res = mockResponse();

        await authenticate("authenticateTest", undefined, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No password provided",
        });
    });

    test("Invalid username", async () => {
        const res = mockResponse();
        const pwd = await password.hash("testing");
        await new User({
            username: "authenticateTest1",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "testtest",
            verified: false,
            password: pwd,
            createdAt: Date.now(),
        }).save();

        await authenticate("authenticate", "testTEST12!@", res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid username or password",
        });
    });

    test("Invalid password", async () => {
        const res = mockResponse();
        const pwd = await password.hash("testing");
        await new User({
            username: "authenticateTest2",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "testtest",
            verified: false,
            password: pwd,
            createdAt: Date.now(),
        }).save();

        await authenticate("authenticate", "testTEST12!@", res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid username or password",
        });
    });

    test("Valid username and password but not verified", async () => {
        const res = mockResponse();
        const pwd = await password.hash("testing");
        await new User({
            username: "authenticateTest3",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "testtest",
            verified: false,
            password: pwd,
            createdAt: Date.now(),
        }).save();

        await authenticate("authenticateTest3", "testing", res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "User unverified",
        });
    });

    test("Valid username and password and verified", async () => {
        const res = mockResponse();
        const pwd = await password.hash("testing");
        await new User({
            username: "authenticateTest4",
            name: "test_test",
            email: "test_test@test.com",
            verifyCode: "verified",
            verified: true,
            password: pwd,
            createdAt: Date.now(),
        }).save();

        await authenticate("authenticateTest4", "testing", res);
        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalled();
    });
});
