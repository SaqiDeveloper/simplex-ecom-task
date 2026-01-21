import bcrypt from 'bcrypt';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp: string): Promise<string> => {
  return await bcrypt.hash(otp, 10);
};

export const verifyOTPHash = async (otp: string, otpHash: string): Promise<boolean> => {
  return await bcrypt.compare(otp, otpHash);
};

export const getOTPExpiration = (): Date => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  return expiresAt;
};

