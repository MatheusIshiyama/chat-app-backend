const sendMail = require("../../services/sendMail");
require("dotenv").config();

describe("test sendMail", () => {
    it("no email provided", async () => {
        const result = await sendMail(null, "test");
        expect(result).toBe("no email provided");
    });

    it("no verifyCode provided", async () => {
        const result = await sendMail("test");
        expect(result).toBe("no verifyCode provided");
    });

    it("no subject provided", async () => {
        const result = await sendMail("test", "test", null);
        expect(result).toBe("no subject provided");
    });

    it("invalid email provided", async () => {
        const result = await sendMail("test", "test", "test");
        expect(result).toBe("invalid email type");
    });

    it("valid email", async () => {
        const result = await sendMail(process.env.EMAIL, "test", "testing");
        expect(result).toBe("email sent");
    });
});
