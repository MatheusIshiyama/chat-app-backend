const authenticate = require("../../middlewares/authenticate");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const mockRequest = (content) => {
    return { headers: content };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Test authenticate middleware", () => {
    test("Authorization undefined", () => {
        const req = mockRequest({ authorization: undefined });
        const res = mockResponse();

        authenticate(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "No token provided",
        });
    });

    test("Token one part", () => {
        const req = mockRequest({ authorization: "token" });
        const res = mockResponse();

        authenticate(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Token error",
        });
    });

    test("Token malformatted", () => {
        const req = mockRequest({ authorization: "token test_test" });
        const res = mockResponse();

        authenticate(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Token malformatted",
        });
    });

    test("Valid token", () => {
        const token = jwt.sign({ id: "testest" }, "testTest");
        const req = mockRequest({ authorization: "Bearer " + token });
        const res = mockResponse();
        const next = jest.fn();

        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid token",
        });
    });

    test("Valid token", () => {
        const token = jwt.sign({ id: "testest" }, process.env.JWT_SECRET);
        const req = mockRequest({ authorization: "Bearer " + token });
        const res = mockResponse();
        const next = jest.fn();

        authenticate(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
