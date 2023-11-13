const db = require('../config/firebase');

async function addData(data) {
    const res = await db.collection('RandomNumber')
                        .doc('test')
                        .set({data, duration: new Date(Date.now() + 120*1000)});
    console.log("Data added:", res);
}

module.exports = addData;
