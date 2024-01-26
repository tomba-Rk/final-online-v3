// paymentRoutes.js

const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay.js');
const crypto = require('crypto');
const db = require('../config/firebase');
const shortid = require('shortid');

const admin = require('firebase-admin');

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
      `https://online-lagw.netlify.app/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

// API to create a referral link
router.post('/create-referral', async (req, res) => {
  const { userId,origin } = req.body;
  const referralId = shortid.generate();

  const userRef = db.collection('users').doc(userId);
  await userRef.set({
      referralId: referralId,
      referrals: []
  });

  res.json({ referralLink:  `${origin}/signup?ref=${referralId}`});
});


// Endpoint to verify a referral and update the user balance
router.post('/verifyReferral', async (req, res) => {
  const { newUser, referralId } = req.body;

  if (!newUser || !referralId) {
    return res.status(400).send('Both newUser and referralId are required');
  }

  try {
    // Find the user who owns the referral ID
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('referralId', '==', referralId).get();

    if (snapshot.empty) {
      return res.status(404).send('Referral ID not found');
    }

    console.log(snapshot);
    let referrerUserId;
    snapshot.forEach(doc => {
      referrerUserId = doc.id;
    });

    // Update the referrer's balance
    const referrerRef = db.collection('Customers').doc(referrerUserId);
    console.log("referrerRef ",referrerRef);
    // const updatedBalance = currentBalance + increaseAmount;
    console.log("referal",referrerRef);
    await referrerRef.update({
      userBalance:admin.firestore.FieldValue.increment(100),
      award:admin.firestore.FieldValue.increment(100),
    },{ merge: true });

    res.status(200).send(`Referral verified. User balance updated for user ID: ${referrerUserId}`);
  } catch (error) {
    console.error('Error verifying referral:', error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;
