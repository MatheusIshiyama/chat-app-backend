const validateRegister = require("../../middlewares/validateRegister");
const mongoose = require("mongoose");
const User = require("../../models/user");
require("dotenv").config();

const passwordTest = (password) => {
    return {
        body: {
            username: "test_test_test",
            name: "test",
            email: "test@test.com",
            password,
        },
    };
};

const mockRequest = (content) => {
    return { body: content };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Test validateRegister middleware", () => {
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

    describe('Test body["username"]', () => {
        test("Username undefined", async () => {
            const req = mockRequest({ username: undefined });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No username provided or no length accept",
            });
        });

        test("Username length smaller then 4", async () => {
            const req = mockRequest({ username: "tes" });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No username provided or no length accept",
            });
        });

        test("Username length bigger then 16", async () => {
            const req = mockRequest({ username: "test_test_test_test" });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No username provided or no length accept",
            });
        });

        test("Valid username and undefined name", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: undefined,
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No name provided or no length accept",
            });
        });
    });

    describe('Test body["name"]', () => {
        test("Name length smaller than 3", async () => {
            const req = mockRequest({ username: "test_test_test", name: "te" });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No name provided or no length accept",
            });
        });

        test("Name length bigger than 16", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test_test_test_test",
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No name provided or no length accept",
            });
        });

        test("Valid name and undefined email", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: undefined,
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No email provided or invalid format",
            });
        });
    });

    describe('Test body["emai"]', () => {
        test("Invalid email format", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test.com",
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No email provided or invalid format",
            });
        });

        test("Valid email and undefined password", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: undefined,
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });
    });

    describe('Test body["password"]', () => {
        test("Password length smaller than 8", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "test",
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password length bigger than 16", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "test_test_test_test",
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase", async () => {
            const req = passwordTest("TESTTEST");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase and lowercase", async () => {
            const req = passwordTest("testTEST");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase and numbers", async () => {
            const req = passwordTest("TESTTEST12345");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase and symbols", async () => {
            const req = passwordTest("TESTTEST@");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase lowercase and numbers", async () => {
            const req = passwordTest("TESTtest12345");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase lowercase and symbols", async () => {
            const req = passwordTest("TESTtest!@#");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password uppercase numbers and symbols", async () => {
            const req = passwordTest("TEST12345!@#");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password lowercase", async () => {
            const req = passwordTest("testtest");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password lowercase and numbers", async () => {
            const req = passwordTest("testtest12");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password lowercase and symbols", async () => {
            const req = passwordTest("testtest@!");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password lowercase numbers and symbols", async () => {
            const req = passwordTest("test123@@!");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password numbers", async () => {
            const req = passwordTest("123456789");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password numbers and symbols", async () => {
            const req = passwordTest("123456!@#");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Password only symbols", async () => {
            const req = passwordTest("!@#$!@#$");
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No password provided or doesn't match params",
            });
        });

        test("Valid password and undefined checkPassword", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testTest123@!",
                checkPassword: undefined,
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No checkPassword provided or passwords doesn't match",
            });
        });
    });

    describe('Test body["checkPassword"]', () => {
        test("Differents passwords", async () => {
            const req = mockRequest({
                username: "test_test_test",
                name: "test",
                email: "test@test.com",
                password: "testTest123@!",
                checkPassword: "test123123",
            });
            const res = mockResponse();

            await validateRegister(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "No checkPassword provided or passwords doesn't match",
            });
        });

        test("Same passwords", async () => {
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
        const newUser = new User({
            username: "validateregister",
            email: "validateRegister@chatApp.com",
        });
        await newUser.save();

        describe("Test user avaliable", () => {
            test("Username already registered", async () => {
                const req = mockRequest({
                    username: "validateregister",
                    name: "test",
                    email: "validateRegister@chatApp.com",
                    password: "testTest123@!",
                    checkPassword: "testTest123@!",
                });
                const res = mockResponse();

                await validateRegister(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Username or Email already exists",
                });
            });

            test("Email already registered", async () => {
                const req = mockRequest({
                    username: "registervalidate",
                    name: "test",
                    email: "validateRegister@chatApp.com",
                    password: "testTest123@!",
                    checkPassword: "testTest123@!",
                });
                const res = mockResponse();

                await validateRegister(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Username or Email already exists",
                });
            });

            test("Username and email avaliable", async () => {
                const req = mockRequest({
                    username: "registeraccept",
                    name: "test",
                    email: "registerAccept@chatApp.com",
                    password: "testTest123@!",
                    checkPassword: "testTest123@!",
                });
                const res = mockResponse();
                const next = jest.fn();

                await validateRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });

        await User.findOneAndDelete({
            username: "validateregister",
        });
        await mongoose.disconnect();
        console.log("[DEV_DATABASE] Disconnected");
    });
});
