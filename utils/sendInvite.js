const nodemailer = require('nodemailer');
require('dotenv').config();

const sendInvite = async ({ name, email, role }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // app password from Gmail
    },
  });

  const mailOptions = {
    from: `"Smart Task Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You're invited as a ${role}`,
    html: `
      <p>Hello <strong>${name}</strong>,</p>
      <p>You have been added to the <strong>Smart Task Manager</strong> team as a <strong>${role}</strong>.</p>
      <p>Please <a href="https://yourapp.com/login">login here</a> to get started.</p>
      <br />
      <p>Thank you,</p>
      <p>The Smart Task Manager Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Invite sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send invite:", err);
  }
};

module.exports = sendInvite;
