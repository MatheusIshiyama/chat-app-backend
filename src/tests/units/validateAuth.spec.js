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

describe("test validate auth", () => {
    it("undefined username", () => {
        const req = mockRequest({ username: undefined });
        const res = mockResponse();

        const response = validateAuth(req, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No username provided",
        });
    });

    it("undefined password", () => {
        const req = mockRequest({ username: "Test" });
        const res = mockResponse();

        const response = validateAuth(req, res);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "No password provided",
        });
    });

    it("username and password provided", async () => {
        const req = mockRequest({ username: "Test", password: "test" });
        const res = mockResponse();
        const next = jest.fn();

        await validateAuth(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
