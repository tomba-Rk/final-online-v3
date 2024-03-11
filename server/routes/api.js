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
  //i have added rewardGiven from the recharge endpoint
  await userRef.set({
      referralId: referralId,
      rewardGiven:false,
      referrals: []
  });

  res.json({ referralLink:  `https://sixdraw.in/signup?ref=${referralId}`});
  // res.json({ referralLink:  `http://localhost:3000/signup?ref=${referralId}`});
});

// Endpoint to verify referral information and link the new user to the referrer.
router.post('/verifyReferral', async (req, res) => {
  // Extract newUser and referralId from the request body.
  const { newUser, referralId } = req.body;

  console.log("hello testig for referral");
  // Query the 'users' collection for a document with a matching referralCode.
  const referrerSnapshot = await db.collection('users').where('referralId', '==', referralId).get();

  if (!referrerSnapshot.empty) {
    // If a matching referrer is found, extract their UID.
    const referrerId = referrerSnapshot.docs[0].id;

    console.log("hello testig for referral inside the code");
    // Update the new user's document to include 'referredBy' field pointing to the referrer's UID.
    // This links the new user (User B) to the referrer (User A).
    await db.collection('users').doc(newUser).set({
      referredBy: referrerId,
    }, { merge: true });

    // Send a success response indicating the referral link verification and linking process was successful.
    res.send('Signup successful with referral');
  } else {
    // If no matching referrer is found, send an error response indicating the referral code is invalid.
    res.status(400).send('Invalid referral code');
  }
});




// POST endpoint to process a recharge action.
// Requires 'userId' and 'amount' in the request body.
router.post('/recharge', async (req, res) => {
  // Extract userId and amount from the request body.
  const { userId, amount } = req.body;
  
  // Define the minimum recharge amount that qualifies for a reward.
  const minimumRechargeAmountForReward = 100;

  try {
    // Retrieve the document for the user (User B) who is recharging.
    const userDoc = await db.collection('users').doc(userId).get();

    // Check if the user document exists.
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const user = userDoc.data();

    // Check if the recharge amount meets the minimum threshold, if the user was referred,
    // and if the reward for this specific referral has not already been given.
    if (amount >= minimumRechargeAmountForReward && user.referredBy && !user.rewardGiven) {
      // Fetch the referrer's (User A) document from Firestore using the 'referredBy' field.
      //i change this code from user to customer
      const referrerDoc = await db.collection('Customers').doc(user.referredBy).get();

      if (referrerDoc.exists) {
        // If the referrer exists, update their rewards.
        // This example increments the referrer's rewards by 50 units.
        await db.collection('Customers').doc(user.referredBy).update({
          award: admin.firestore.FieldValue.increment(50), // Update the rewards field with the new reward amount.
          userBalance:admin.firestore.FieldValue.increment(50), // Update the rewards field with the new reward amount.
        });

        // Update the referred user's (User B) document to indicate that the reward for this referral has been given.
        // This prevents rewarding the referrer multiple times for the same referral.
         //i change this code from user to customer for i want to add this rewardgiven property 
         //to the customer collection
         //sorry i change my mind i have added rewardgiven in the create-referral
        await db.collection('users').doc(userId).update({
          rewardGiven: true
        });

        // Send a success response indicating that the recharge was successful and the referrer has been rewarded.
        res.send('Recharge successful, referrer rewarded.');
      } else {
        // Handle the case where the referrer's document does not exist.
        res.status(404).send('Referrer not found');
      }
    } else {
      // If the conditions for rewarding are not met, process the recharge without rewarding.
      // This could happen if the amount is less than the required minimum,
      // the user was not referred, or the reward has already been given.
      res.send('Recharge successful, conditions for rewarding not met.');
    }
  } catch (error) {
    // Catch and handle any errors that occur during the process.
    console.error('Error processing recharge:', error);
    res.status(500).send('Error processing recharge');
  }
});




module.exports = router;
