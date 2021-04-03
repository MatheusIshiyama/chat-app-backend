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

describe("test validate code", () => {
    it("undefined code", () => {
        const req = mockRequest({ verifyCode: null });
        const res = mockResponse();

        const response = validateCode(req, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No verifyCode provided",
        });
    });

    it("invalid code length", () => {
        const req = mockRequest({ verifyCode: "testtest" });
        const res = mockResponse();

        const response = validateCode(req, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No verifyCode length accept",
        });
    });

    it("valid code", () => {
        const code = crypto.randomBytes(128).toString("base64");
        const req = mockRequest({ verifyCode: code });
        const res = mockResponse();
        const next = jest.fn();

        validateCode(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
