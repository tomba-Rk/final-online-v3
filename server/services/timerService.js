const { generateOTP } = require('../utils/helpers');
const addData = require('../db/dataService');

let startingTime = 0;

const updateTime = () => {
    startingTime--;
    if (startingTime === 0) {
        startingTime = 120;
        const result = generateOTP();
        console.log("Generated OTP:", result);
        addData({ ...result });
    }
};

module.exports = {
    updateTime,
    startingTime
};
