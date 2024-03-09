// paymentRoutes.js

const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay.js');
const crypto = require('crypto');
const db = require('../config/firebase');
const shortid = require('shortid');

const admin = require('firebase-admin');



// API to create a referral link
router.post('/create-referral', async (req, res) => {
  const { userId,origin } = req.body;
  const referralId = shortid.generate();

  const userRef = db.collection('users').doc(userId);
  await userRef.set({
      referralId: referralId,
      referrals: []
  });

  res.json({ referralLink:  `https://online-lagw.netlify.app/signup?ref=${referralId}`});
  // res.json({ referralLink:  `http://localhost:3000/signup?ref=${referralId}`});
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
