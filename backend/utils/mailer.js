const nodemailer = require("nodemailer");

const transportor = nodemailer.createTransport({
    host: "gmail",
    port: 500,
    secure: true,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    }
})

const sendMail = async (user, text) => {
    await transportor.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: user.email,
        subject: "Email Verification",
        text: text
    });
};

module.exports = { sendMail };