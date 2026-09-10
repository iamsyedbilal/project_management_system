import User from '../models/user.model.js';
import type { LoginUserServiceData, RegisterUserServiceData } from '../types/auth.type.js';
import ApiError from '../utils/apiError.js';
import { emailVerificationMailGenContent, sendEmail } from '../utils/mail.js';

// Generate Access Token & Refresh Token
const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerUserService = async (userData: RegisterUserServiceData, baseUrl: string) => {
  const { password } = userData;

  const username = userData.username.trim().toLowerCase();
  const email = userData.email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User  already registered');
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
        `${baseUrl}/api/v1/users/verify-email/${unHashedToken}`,
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
