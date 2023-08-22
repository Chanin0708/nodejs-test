require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../model/user"); // Make sure the correct path is used
const router = express.Router();

// Define Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "smtp.inetmail.cloud",
  auth: {
    user: "itgsupport@intelligist.co.th",
    pass: "P@ssw0rd@ITG",
  },
});

// Path to the email template
const emailTemplatePath = path.join(__dirname, "../../mail/register.html");

// Function to send registration email
const sendRegistrationEmail = async (user) => {
  try {
    // Load HTML email template from file
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Welcome to Our App",
      html: emailTemplate,
    });

    console.log("Registration email sent successfully.");
  } catch (error) {
    console.error("Error sending registration email:", error);
  }
};

// User registration route
router.post("/", async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      // national_id,
      // national_id_mode,
      // policy_id,
      password,
    } = req.body;

    if (
      !(
        email &&
        firstname &&
        lastname &&
        // national_id &&
        // national_id_mode &&
        // policy_id &&
        password
      )
    ) {
      return res.status(400).json({ message: "All input is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Please login" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      firstname,
      lastname,
      national_id,
      national_id_mode,
      policy_id,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();

    await sendRegistrationEmail(savedUser);

    const token = jwt.sign(
      { user_id: savedUser._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    savedUser.token = token;
    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
