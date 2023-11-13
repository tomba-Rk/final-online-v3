// sendEmail.js
const transporter = require('./transporter');

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return { status: 200, message: 'Email sent successfully!' };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = sendEmail;