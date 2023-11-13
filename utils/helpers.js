const { between } = require('../randomNumber/generateNumbers');

const generateOTP = () => {
  return Array.from({ length: 6 }, () => between(1, 6));
};

module.exports = {
  generateOTP
};
