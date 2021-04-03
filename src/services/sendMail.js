const nodeMailer = require("nodemailer");
const validateBody = require("./validateBody");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendEmail = async (email, verifyCode, subject) => {
    if (!email) return "no email provided";
    if (!verifyCode) return "no verifyCode provided";
    if (!subject) return "no subject provided";

    const isValid = validateBody.email(email);
    if (!isValid) return "invalid email type";

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        text: `${process.env.CONFIRM_URL}/${verifyCode}`,
    };

    await transporter.sendMail(mailOptions);

    return "email sent";
};

module.exports = sendEmail;
