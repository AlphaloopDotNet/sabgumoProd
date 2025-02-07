// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
// CORS configuration
const corsOptions = {
  origin: ["https://sabgumo.com", "http://localhost:5173","https://www.sabgumo.com"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cors());

// Debugging route
app.get("/", (req, res) => {
  res.send("Hello from Express on Vercel!");
});

// Email sending route
app.post("/send-email", async (req, res) => {
  const { name, email, phone, destination, guests, travelDates, message } =
    req.body;

  try {
    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email details
    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Trip Inquiry",
      text: `
        New Inquiry Received:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Destination: ${destination}
        Guests: ${guests}
        Travel Dates: ${travelDates}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Export the handler for Vercel
module.exports = app;
