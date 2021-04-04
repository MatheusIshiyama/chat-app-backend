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

describe("test authenticate middleware", () => {
    it("undefined authorization", () => {
        const req = mockRequest({ authorization: undefined });
        const res = mockResponse();

        const response = authenticate(req, res);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "No token provided",
        });
    });

    it("token one part", () => {
        const req = mockRequest({ authorization: "token" });
        const res = mockResponse();

        const response = authenticate(req, res);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "Token error",
        });
    });

    it("token malformatted", () => {
        const req = mockRequest({ authorization: "token test_test" });
        const res = mockResponse();

        const response = authenticate(req, res);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "Token malformatted",
        });
    });

    it("valid token", () => {
        const token = jwt.sign({ id: "testest" }, process.env.JWT_SECRET);
        const req = mockRequest({ authorization: "Bearer "+ token });
        const res = mockResponse();
        const next = jest.fn();

        authenticate(req, res, next);
        
        expect(next).toHaveBeenCalled();
    });
});
