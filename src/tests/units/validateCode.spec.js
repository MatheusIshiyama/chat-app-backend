const validateCode = require("../../middlewares/validateCode");
const crypto = require("crypto");

const mockRequest = (content) => {
    return { params: content };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Test validateCode middleware", () => {
    test("Code undefined", () => {
        const req = mockRequest({ verifyCode: undefined });
        const res = mockResponse();

        validateCode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No verifyCode provided",
        });
    });

    test("Invalid code length", () => {
        const req = mockRequest({ verifyCode: "testtest" });
        const res = mockResponse();

        validateCode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No verifyCode length accept",
        });
    });

    test("Valid code", () => {
        const code = crypto.randomBytes(128).toString("base64");
        const req = mockRequest({ verifyCode: code });
        const res = mockResponse();
        const next = jest.fn();

        validateCode(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
