const validateRegister = require("../../middlewares/validateRegister");
const mongoose = require("mongoose");
const userModel = require("../../models/user");
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

describe("test validateRegister middleware", () => {
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

    it("undefined body", async () => {
        const req = mockRequest();
        const res = mockResponse();

        const response = await validateRegister(req, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No body provided",
        });
    });

    describe('test body["username"]', () => {
        it("undefined username", async () => {
            const req = mockRequest({ email: "test" });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No username provided or no length accept",
            });
        });

        it("username length smaller then 4", async () => {
            const req = mockRequest({ username: "tes" });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No username provided or no length accept",
            });
        });

        it("username length bigger then 16", async () => {
            const req = mockRequest({ username: "test_test_test_test" });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No username provided or no length accept",
            });
        });

        it("valid username and undefined name", async () => {
            const req = mockRequest({ username: "test_test_test" });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No name provided or no length accept",
            });
        });
    });

    describe('test body["name"]', () => {
        it("name length smaller than 3", async () => {
            const req = mockRequest({ username: "test_test_test", name: "te" });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No name provided or no length accept",
            });
        });

        it("name length bigger than 16", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test_test_test_test",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No name provided or no length accept",
            });
        });

        it("valid name and undefined email", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No email provided or invalid format",
            });
        });
    });

    describe('test body["emai"]', () => {
        it("invalid email format", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test.com",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No email provided or invalid format",
            });
        });

        it("valid email and undefined password", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });
    });

    describe('test body["password"]', () => {
        it("password length smaller than 8", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "test",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password length bigger than 16", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "test_test_test_test",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "TESTTEST",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase and lowercase", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testTEST",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase and numbers", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "TESTTEST12345",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase and symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "TESTTEST@",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase lowercase and numbers", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "TESTtest12345",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase lowercase and symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "TESTtest!@#",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password uppercase numbers and symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "TEST12345!@#",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password lowercase", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testtest",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password lowercase and numbers", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testtest12",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password lowercase and symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testtest@!",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password lowercase numbers and symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "test123@@!",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password numbers", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "123456789",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password numbers and symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "123456!@#",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("password only symbols", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "!@#$!@#$",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No password provided or doesn't match params",
            });
        });

        it("valid password and undefined checkPassword", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testTest123@!",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No checkPassword provided or passwords doesn't match",
            });
        });
    });

    describe('test body["checkPassword"]', () => {
        it("differents passwords", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testTest123@!",
                checkPassword: "test123123",
            });
            const res = mockResponse();

            const response = await validateRegister(req, res);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "No checkPassword provided or passwords doesn't match",
            });
        });

        it("same passwords", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testTest123@!",
                checkPassword: "testTest123@!",
            });
            const res = mockResponse();
            const next = jest.fn();

            await validateRegister(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    afterAll(async () => {
        const newUser = new userModel({
            username: "test_test",
            email: "test@test.com",
        });
        await newUser.save();

        describe("test user avaliable", () => {
            it("username already registered", async () => {
                const req = mockRequest({
                    username: "test_test",
                    name: "test",
                    email: "test@test.com",
                    password: "testTest123@!",
                    checkPassword: "testTest123@!",
                });
                const res = mockResponse();

                const response = await validateRegister(req, res);
                expect(response.status).toHaveBeenCalledWith(400);
                expect(response.json).toHaveBeenCalledWith({
                    message: "Username or Email already exists",
                });
            });

            it("email already registered", async () => {
                const req = mockRequest({
                    username: "testtest",
                    name: "test",
                    email: "test@test.com",
                    password: "testTest123@!",
                    checkPassword: "testTest123@!",
                });
                const res = mockResponse();

                const response = await validateRegister(req, res);
                expect(response.status).toHaveBeenCalledWith(400);
                expect(response.json).toHaveBeenCalledWith({
                    message: "Username or Email already exists",
                });
            });

            it("username and email avaliable", async () => {
                const req = mockRequest({
                    username: "testtest",
                    name: "test",
                    email: "test@testing.com",
                    password: "testTest123@!",
                    checkPassword: "testTest123@!",
                });
                const res = mockResponse();
                const next = jest.fn();

                await validateRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });

        const findUser = await userModel.findOne({ username: "test_test" });
        await findUser.delete();
        await mongoose.disconnect();
        console.log("[DEV_DATABASE] Disconnected");
    });
});
