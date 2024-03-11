const db = require('../config/firebase');
const admin = require('firebase-admin');

async function addData(data) {
    try {
        const expirationTimestamp = new Date(Date.now() + 120 * 1000); // 120 seconds from now
        const res = await db.collection('RandomNumber')
                            .doc('test')
                            .set({
                                data, 
                                expirationTime: expirationTimestamp.toISOString() // Storing as ISO string
                            });
        console.log("Data added:", res);

    

    // Reference to the 'today-test' document in the 'RandomNumber' collection
    const docRef = db.collection('RandomNumber').doc('today-test');
    
    // Update the document with the random number, adding it to the 'numbers' array field
    // This will create the document if it doesn't exist, or update it without overwriting other content
    const res_new = await docRef.set({
        numbers: admin.firestore.FieldValue.arrayUnion(data)
    }, { merge: true }); // Using 'merge: true' to ensure other fields are not overwritten
    
    console.log("Random number added:", res_new);
    } catch (error) {
        console.error("Error adding data:", error);
        // Handle the error appropriately
    }
}


module.exports = addData;
