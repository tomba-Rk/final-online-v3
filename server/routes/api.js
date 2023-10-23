// paymentRoutes.js

const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay.js');
const crypto = require('crypto');
const db = require('../config/firebase');


router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await razorpay.orders.create(options);
  
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.post('/paymentverification', async (req, res) => {
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  const userUid = req.query.user_uid;
  if (isAuthentic) {
    // Database comes here

    // await Payment.create({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature,
    // });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amount = payment.amount / 100; // convert to rupees
    const userRef = db.collection('Customers').doc(userUid);
  try {
    await db.runTransaction(async transaction => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User does not exist!');
      }

      const currentBalance = userDoc.data().userBalance || 0;
      const newBalance = currentBalance +amount;

      transaction.update(userRef, { userBalance: newBalance });
    });
    console.log('User balance updated successfully!');
    } catch (error) {
    console.error('Failed to update user balance:', error);
    }

    
    console.log('userUid', userUid);
    
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
