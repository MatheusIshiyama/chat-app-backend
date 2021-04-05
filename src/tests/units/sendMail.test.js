const sendMail = require("../../services/sendMail");
require("dotenv").config();

test("Test sendMail service", async () => {
    //* email undefined
    expect(await sendMail(undefined, "test")).toBe("No email provided");

    //* verifyCode undefined
    expect(await sendMail("test", undefined)).toBe("No verifyCode provided");

    //* subject undefined
    expect(await sendMail("test", "test", undefined)).toBe(
        "No subject provided"
    );

    //* invalid email
    expect(await sendMail("test", "test", "test")).toBe("Invalid email format");

    //* valid email
    expect(await sendMail(process.env.EMAIL, "test", "testing")).toBe(
        "Email sent"
    );
});
