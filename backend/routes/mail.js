const express = require("express");
const Mail = require('../models/Club.model');
const router = express.Router();
const nodemailer = require("nodemailer");

const sendNotification = async (emails, subject, message, clubUnique, EMAIL_USER, EMAIL_PASSWORD) => {
    const emailMessage = `${message} \n\n From: ${clubUnique}`;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  
    const mailOptions = {
      from: EMAIL_USER,
      to: emails.join(', '),  // Join the emails with commas
      subject: subject,
      text: emailMessage
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Emails sent successfully!");
    } catch (error) {
      console.error("Error sending emails:", error);
      throw error;
    }
  };
  
  // Define the route
  router.post('/sendMail', async (req, res) => {
    
    const { emails, subject, message, clubUnique } = req.body; // Receive the email list from the body
    console.log("EVENT RECIVED: ",subject);
    // Check if email list is provided
    if (!emails || emails.length === 0) {
      return res.status(400).send({ success: false, message: 'No email addresses provided.' });
    }
  
    try {
      // Send the email
      await sendNotification(emails, subject, message, clubUnique, process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
      res.status(200).send({ success: true, message: 'Emails sent successfully!' });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Error sending emails', error });
    }
  });
  
  module.exports = router;
  
module.exports = router;
