const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP expiry time (10 minutes from now)
const getOTPExpiry = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  return now;
};

module.exports = {
  generateOTP,
  getOTPExpiry,
};