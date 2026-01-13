const bcrypt = require("bcrypt");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

const verifyOTPHash = async (otp, otpHash) => {
  return await bcrypt.compare(otp, otpHash);
};

const getOTPExpiration = () => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  return expiresAt;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTPHash,
  getOTPExpiration,
};

