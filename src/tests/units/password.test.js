const password = require("../../services/password");

describe("test password functions", () => {
    it("hash password", () => {
        const result = password.hash("testtest");
        expect(result).toHaveLength(60);
    });

    it("compare differents passwords", () => {
        const pwd = "testtest";
        const hashPassword = password.hash("testTEST");
        const result = password.validate(pwd, hashPassword);
        expect(result).toBe(false);
    });

    it("compare same passwords", () => {
        const pwd = "testtest";
        const hashPassword = password.hash(pwd);
        const result = password.validate(pwd, hashPassword);
        expect(result).toBe(true);
    })
});