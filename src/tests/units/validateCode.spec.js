const validateCode = require("../../middlewares/validateCode");
const generateCode = require("../../services/generateCode");

const mockRequest = (content) => {
    return { body: content };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Test validateCode middleware", () => {
    test("Code undefined", () => {
        const req = mockRequest({ code: undefined });
        const res = mockResponse();

        validateCode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No code provided",
        });
    });

    test("Invalid code length", () => {
        const req = mockRequest({ code: "test" });
        const res = mockResponse();

        validateCode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No code length accept",
        });
    });

    test("Valid code", () => {
        const code = generateCode();
        const req = mockRequest({ code });
        const res = mockResponse();
        const next = jest.fn();

        validateCode(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
