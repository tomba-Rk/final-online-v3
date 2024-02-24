require('dotenv').config();

const PORT = process.env.PORT || 4001;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('Error: Missing Razorpay credentials');
  process.exit(1);
}

module.exports = {
  PORT,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
};
