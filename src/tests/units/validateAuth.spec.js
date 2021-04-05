const validateAuth = require("../../middlewares/validateAuth");

const mockRequest = (content) => {
    return { body: content };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Test validateAuth middleware", () => {
    test("Username undefined", () => {
        const req = mockRequest({ username: undefined });
        const res = mockResponse();

        validateAuth(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No username provided",
        });
    });

    test("Password undefined", () => {
        const req = mockRequest({ username: "Test", password: undefined });
        const res = mockResponse();

        validateAuth(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "No password provided",
        });
    });

    test("Username and password provided", async () => {
        const req = mockRequest({ username: "Test", password: "test" });
        const res = mockResponse();
        const next = jest.fn();

        await validateAuth(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
