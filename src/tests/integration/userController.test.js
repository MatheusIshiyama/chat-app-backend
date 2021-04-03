const userController = require("../../controllers/user");
const userModel = require("../../models/user");
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
    await userModel.findOneAndDelete({ username: "testtest" });
    await userModel.findOneAndDelete({ username: "test_test" });
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

        const user = new userModel({
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
});
