const db = require('../config/firebase');

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
    } catch (error) {
        console.error("Error adding data:", error);
        // Handle the error appropriately
    }
}


module.exports = addData;
