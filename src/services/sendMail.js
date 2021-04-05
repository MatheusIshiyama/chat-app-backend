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
    if (!email) return "No email provided";
    if (!verifyCode) return "No verifyCode provided";
    if (!subject) return "No subject provided";

    const isValid = validateBody.email(email);
    if (!isValid) return "Invalid email format";

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        text: `${process.env.CONFIRM_URL}/${verifyCode}`,
    };

    await transporter.sendMail(mailOptions);

    return "Email sent";
};

module.exports = sendEmail;
