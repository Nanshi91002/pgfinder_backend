// const { text } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSend = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html  // correct
    };

    // console.log(mailSend);
    

    const mailResponse = await transporter.sendMail(mailOptions);

    console.log("Email Sent Successfully:", mailResponse);

    return mailResponse;

  } catch (error) {
    console.log("Error while sending mail:", error);
  }
};

module.exports = mailSend;