import User from '../models/user.model.js';
import crypto from 'crypto';
import type {
  ChangeCurrentPasswordServiceData,
  LoginUserServiceData,
  RegisterUserServiceData,
  ResetForgotPasswordServiceData,
} from '../types/auth.type.js';
import ApiError from '../utils/apiError.js';
import {
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
  sendEmail,
} from '../utils/mail.js';
import jwt from 'jsonwebtoken';

// Hash a token before storing it in the database
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verify the access token and attach the authenticated user to the request
const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
  };
};

// Register a new user and send email verification
export const registerUserService = async (userData: RegisterUserServiceData, baseUrl: string) => {
  const { password } = userData;

  const username = userData.username.trim().toLowerCase();
  const email = userData.email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User already registered');
  }

  const user = new User({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { hashedToken, unHashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: 'Please verify your email',
      mailgenContent: emailVerificationMailGenContent(
        user.username,
        `${baseUrl}/api/v1/auth/verify-email/${unHashedToken}`,
      ),
    });
  } catch (error) {
    throw new ApiError(500, 'User created, but failed to send verification email.');
  }

  const createdUser = await User.findById(user._id)
    .select('-password -refreshToken -emailVerificationToken -emailVerificationExpiry')
    .lean();

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering a user');
  }

  return createdUser;
};

// Authenticate user and generate access/refresh tokens
export const loginUserService = async (userData: LoginUserServiceData) => {
  const { identifier, password } = userData;
  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
  }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid username/email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid username/email or password');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
  );

  if (!loggedInUser) {
    throw new ApiError(500, 'Error while logging in the user');
  }

  return { loggedInUser, accessToken, refreshToken };
};

// Logout user by removing the refresh token from the database
export const logoutUserService = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: 'after',
    },
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return true;
};

// Refresh access token using refresh token
export const refreshAccessTokenService = async (refreshToken: string) => {
  let decoded: { _id: string };

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { _id: string };
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded._id).select('+refreshToken');

  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const hashedRefreshToken = hashToken(refreshToken);

  if (user.refreshToken !== hashedRefreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Rotate both tokens
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // Store only the new refresh token hash
  user.refreshToken = hashToken(newRefreshToken);

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Verify Email Service
export const verifyEmailService = async (verificationToken: string) => {
  let hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or expired');
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  user.isEmailVerified = true;
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
};

// Resend Email Verification Service
export const resendEmailVerificationService = async (baseUrl: string, email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.isEmailVerified) {
    return;
  }

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  user.refreshToken = undefined;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: 'Please verify your email',
    mailgenContent: emailVerificationMailGenContent(
      user.username,
      `${baseUrl}/api/v1/auth/verify-email/${unHashedToken}`,
    ),
  });
};

// Forgot Password Request Service
export const forgotPasswordRequestService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return;
  }

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user?.email,
      subject: 'Password reset request',
      mailgenContent: forgotPasswordMailGenContent(
        user.username,
        `http://localhost:8000/api/v1/auth/reset-password/${unHashedToken}`,
      ),
    });
  } catch (error) {
    throw new ApiError(500, 'Password reset email could not be sent. Please try again later.');
  }
};

// Reset Forgot Password Service
export const resetForgotPasswordService = async ({
  resetToken,
  password,
}: ResetForgotPasswordServiceData) => {
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or expired');
  }

  user.password = password;
  user.refreshToken = undefined;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;

  await user.save();
};

// Change Current Password Service
export const changeCurrentPasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}: ChangeCurrentPasswordServiceData) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const isSamePassword = await user.comparePassword(newPassword);

  if (isSamePassword) {
    throw new ApiError(400, 'New password must be different from current password');
  }

  user.password = newPassword;
  user.refreshToken = undefined;

  await user.save();
};
