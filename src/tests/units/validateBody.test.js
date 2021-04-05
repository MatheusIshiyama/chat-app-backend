const {
    username,
    name,
    email,
    password,
    checkPassword,
} = require("../../services/validateBody");

describe("Test validateBody service", () => {
    test("Test username function", () => {
        //* username undefined
        expect(username(undefined)).toBeFalsy();

        //* username length smaller than 4
        expect(username("tes")).toBeFalsy();

        //* username length bigger than 16
        expect(username("test_test_test_test")).toBeFalsy();

        //* valid username
        expect(username("test_test")).toBeTruthy();
    });

    test("Test name function", () => {
        //* name undefined
        expect(name(undefined)).toBeFalsy();

        //* name length smaller than 3
        expect(name("te")).toBeFalsy();

        //* name length bigger than 16
        expect(name("test_test_test_test")).toBeFalsy();

        //* valid name
        expect(name("test")).toBeTruthy();
    });

    test("Test email function", () => {
        //* email undefined
        expect(email(undefined)).toBeFalsy();

        //* invalid email format
        expect(email("testtest.com")).toBeFalsy();

        //* valid email format
        expect(name("test@test.com")).toBeTruthy();
    });

    test("Test password function", () => {
        //* password undefined
        expect(password(undefined)).toBeFalsy();

        //* password length smaller than 8
        expect(password("test")).toBeFalsy();

        //* password length bigger than 16
        expect(password("test_test_test_test")).toBeFalsy();

        //* password doesn't have requirements
        expect(password("test_test_test_test")).toBeFalsy();

        //* lowercase
        expect(password("testtest")).toBeFalsy();

        //* lowercase and uppercase
        expect(password("testTEST")).toBeFalsy();

        //* lowercase and numbers
        expect(password("test1234")).toBeFalsy();

        //* lowercase and symbols
        expect(password("test!@#$")).toBeFalsy();

        //* lowercase uppercase and numbers
        expect(password("testTEST123")).toBeFalsy();

        //* lowercase uppercase and symbols
        expect(password("testTEST!@")).toBeFalsy();

        //* lowercase numbers and symbols
        expect(password("test1234!@")).toBeFalsy();

        //* uppercase
        expect(password("TESTTEST")).toBeFalsy();

        //* uppercase and numbers
        expect(password("TEST1234")).toBeFalsy();

        //* uppercase and symbols
        expect(password("TEST!@#$")).toBeFalsy();

        //* uppercase numbers and symbols
        expect(password("TEST123!@")).toBeFalsy();

        //* numbers
        expect(password("123456789")).toBeFalsy();

        //* numbers and symbols
        expect(password("1234!@#$")).toBeFalsy();

        //* symbols
        expect(password("!@#$!@#$")).toBeFalsy();

        //* valid password
        expect(password("TestTest123!@")).toBeTruthy();
    });

    test("test checkPassword function", () => {
        //* undefined password
        expect(checkPassword(undefined, "test")).toBeFalsy();

        //* undefined checkPassword
        expect(checkPassword("test", null)).toBeFalsy();

        //* password and checkPassword doesn't match
        expect(checkPassword("test_test", "testtest")).toBeFalsy();

        //* same password checkPassword
        expect(checkPassword("test_test", "test_test")).toBeTruthy();
    });
});
