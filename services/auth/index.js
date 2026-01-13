const bcrypt = require("bcrypt");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { generateToken } = require("../../utils/jwtToken");
const { generateOTP, hashOTP, verifyOTPHash, getOTPExpiration } = require("../../utils/helper");
const { User, Otp } = require('../../models');
const { isSuperAdmin } = require("../../middlewares/admin.middleware");
const { Op } = require('sequelize');

const signUp = asyncErrorHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existingUserByEmail = await User.findOne({
    where: { email: email },
  });

  if (existingUserByEmail) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: TEXTS.EMAIL_ALREADY_EXISTS,
    });
  }

  if (phone) {
    const existingUserByPhone = await User.findOne({
      where: { phone: phone },
    });

    if (existingUserByPhone) {
      return res.status(STATUS_CODES.CONFLICT).json({
        statusCode: STATUS_CODES.CONFLICT,
        message: TEXTS.PHONE_ALREADY_EXISTS,
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name,
    email: email,
    phone: phone || null,
    password: hashedPassword,
    isSuperAdmin: false,
  });

  const userData = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    isSuperAdmin: newUser.isSuperAdmin,
  };

  const accessToken = generateToken(userData);

  res.status(STATUS_CODES.CREATED).json({
    statusCode: STATUS_CODES.CREATED,
    message: TEXTS.REGISTERED_SUCCESS,
    data: userData,
    accessToken: accessToken,
  });
});

const login = asyncErrorHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  const whereClause = email ? { email: email } : { phone: phone };
  
  const user = await User.findOne({
    where: whereClause,
    attributes: ["id", "name", "email", "phone", "password", "isSuperAdmin"],
  });

  if (!user) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.INVALID_CREDENTIALS,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.INVALID_CREDENTIALS,
    });
  }

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isSuperAdmin: user.isSuperAdmin,
  };

  const accessToken = generateToken(userData);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.LOGIN,
    data: userData,
    accessToken: accessToken,
  });
});


const adminLogin = asyncErrorHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  const whereClause = email 
    ? { email: email, isSuperAdmin: true } 
    : { phone: phone, isSuperAdmin: true };
  
  const user = await User.findOne({
    where: whereClause,
    attributes: ["id", "name", "email", "phone", "password", "isSuperAdmin"],
  });

  if (!user) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.INVALID_CREDENTIALS,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.INVALID_CREDENTIALS,
    });
  }

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isSuperAdmin: user.isSuperAdmin,
  };

  const accessToken = generateToken(userData);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.LOGIN,
    data: userData,
    accessToken: accessToken,
  });
});

const requestOTP = asyncErrorHandler(async (req, res) => {
  const { email, phone } = req.body;

  const whereClause = email ? { email: email } : { phone: phone };
  const user = await User.findOne({
    where: whereClause,
    attributes: ["id", "name", "email", "phone"],
  });

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: TEXTS.USER_NOT_FOUND,
    });
  }

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);
  const expiresAt = getOTPExpiration();

  await Otp.update(
    { isUsed: true },
    {
      where: {
        [Op.or]: [
          { userId: user.id },
          { email: email || null },
          { phone: phone || null },
        ],
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    }
  );

  await Otp.create({
    userId: user.id,
    email: email || null,
    phone: phone || null,
    otpHash: otpHash,
    type: email ? 'email' : 'phone',
    expiresAt: expiresAt,
    isUsed: false,
  });

  console.log(`OTP for ${email || phone}: ${otp}`);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.OTP_SENT,
    otp: process.env.NODE_ENV === 'development' ? otp : undefined,
  });
});

const verifyOTP = asyncErrorHandler(async (req, res) => {
  const { email, phone, otp } = req.body;

  const whereClause = email ? { email: email } : { phone: phone };
  const user = await User.findOne({
    where: whereClause,
    attributes: ["id", "name", "email", "phone", "isSuperAdmin"],
  });

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: TEXTS.USER_NOT_FOUND,
    });
  }

  const otpRecord = await Otp.findOne({
    where: {
      [Op.or]: [
        { userId: user.id },
        { email: email || null },
        { phone: phone || null },
      ],
      type: email ? 'email' : 'phone',
      isUsed: false,
      expiresAt: { [Op.gt]: new Date() },
    },
    order: [['createdAt', 'DESC']],
  });

  if (!otpRecord) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.INVALID_OTP,
    });
  }

  const isOTPValid = await verifyOTPHash(otp, otpRecord.otpHash);

  if (!isOTPValid) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.INVALID_OTP,
    });
  }

  // Mark OTP as used
  await otpRecord.update({ isUsed: true });

  // Generate token
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isSuperAdmin: user.isSuperAdmin,
  };

  const accessToken = generateToken(userData);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.OTP_VERIFIED,
    data: userData,
    accessToken: accessToken,
  });
});

module.exports = {
  signUp,
  login,
  adminLogin,
  requestOTP,
  verifyOTP,
};
