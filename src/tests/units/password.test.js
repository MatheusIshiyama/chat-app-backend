const { hash, validate } = require("../../services/password");

test("Test password service", () => {
    //* hash password
    expect(hash("testtest")).toHaveLength(60);

    //* compare differents passwords
    const pwd = "passwordService";
    const diffPassword = hash("testTEST");
    expect(validate(pwd, diffPassword)).toBeFalsy();

    //* compare same passwords
    const hashPassword = hash(pwd);
    expect(validate(pwd, hashPassword)).toBeTruthy();
});
