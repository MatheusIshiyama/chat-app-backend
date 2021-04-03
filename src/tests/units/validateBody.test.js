const {
    username,
    name,
    email,
    password,
    checkPassword,
} = require("../../services/validateBody");

describe("test username function", () => {
    it("undefined username", () => {
        const isValid = username(null);
        expect(isValid).toBe(false);
    });

    it("username length smaller than 4", () => {
        const isValid = username("tes");
        expect(isValid).toBe(false);
    });

    it("username length bigger than 16", () => {
        const isValid = username("test_test_test_test");
        expect(isValid).toBe(false);
    });

    it("valid username", () => {
        const isValid = username("test_test");
        expect(isValid).toBe(true);
    });
});

describe("test name function", () => {
    it("undefined name", () => {
        const isValid = name(null);
        expect(isValid).toBe(false);
    });

    it("name length smaller than 3", () => {
        const isValid = name("te");
        expect(isValid).toBe(false);
    });

    it("name length bigger than 16", () => {
        const isValid = name("test_test_test_test");
        expect(isValid).toBe(false);
    });

    it("valid name", () => {
        const isValid = name("test");
        expect(isValid).toBe(true);
    });
});

describe("test email function", () => {
    it("undefined email", () => {
        const isValid = email(null);
        expect(isValid).toBe(false);
    });

    it("email invalid format", () => {
        const isValid = email("testtest.com");
        expect(isValid).toBe(false);
    });

    it("valid email", () => {
        const isValid = name("test@test.com");
        expect(isValid).toBe(true);
    });
});

describe("test password function", () => {
    it("undefined password", () => {
        const isValid = password(null);
        expect(isValid).toBe(false);
    });

    it("password length smaller than 8", () => {
        const isValid = password("test");
        expect(isValid).toBe(false);
    });

    it("password length bigger than 16", () => {
        const isValid = password("test_test_test_test");
        expect(isValid).toBe(false);
    });

    it("password doesn't have requirements", () => {
        const isValid = password("test_test_test_test");
        expect(isValid).toBe(false);
    });

    it("password lowecase", () => {
        const isValid = password("testtest");
        expect(isValid).toBe(false);
    });

    it("password lowecase and uppercase", () => {
        const isValid = password("testTEST");
        expect(isValid).toBe(false);
    });

    it("password lowecase and numbers", () => {
        const isValid = password("test1234");
        expect(isValid).toBe(false);
    });

    it("password lowecase and symbol", () => {
        const isValid = password("test!@#$");
        expect(isValid).toBe(false);
    });

    it("password lowecase uppercase and numbers", () => {
        const isValid = password("testTEST123");
        expect(isValid).toBe(false);
    });

    it("password lowecase uppercase and symbol", () => {
        const isValid = password("testTEST!@");
        expect(isValid).toBe(false);
    });

    it("password lowecase numbers and symbol", () => {
        const isValid = password("test1234!@");
        expect(isValid).toBe(false);
    });

    it("password uppercase", () => {
        const isValid = password("TESTTEST");
        expect(isValid).toBe(false);
    });

    it("password uppercase and numbers", () => {
        const isValid = password("TEST1234");
        expect(isValid).toBe(false);
    });

    it("password uppercase and symbols", () => {
        const isValid = password("TEST!@#$");
        expect(isValid).toBe(false);
    });

    it("password uppercase numbers and symbols", () => {
        const isValid = password("TEST123!@");
        expect(isValid).toBe(false);
    });

    it("password numbers", () => {
        const isValid = password("123456789");
        expect(isValid).toBe(false);
    });

    it("password numbers and symbols", () => {
        const isValid = password("1234!@#$");
        expect(isValid).toBe(false);
    });

    it("password symbols", () => {
        const isValid = password("!@#$!@#$");
        expect(isValid).toBe(false);
    });

    it("valid password", () => {
        const isValid = password("TestTest123!@");
        expect(isValid).toBe(true);
    });
});

describe("test checkPassword", () => {
    it("undefined password", () => {
        const isValid = checkPassword(null, "test");
        expect(isValid).toBe(false);
    });

    it("undefined checkPassword", () => {
        const isValid = checkPassword("test", null);
        expect(isValid).toBe(false);
    });

    it("password and checkPassword doesn't match", () => {
        const isValid = checkPassword("test_test", "testtest");
        expect(isValid).toBe(false);
    });

    it("same password checkPassword", () => {
        const isValid = checkPassword("test_test", "test_test");
        expect(isValid).toBe(true);
    });
});
