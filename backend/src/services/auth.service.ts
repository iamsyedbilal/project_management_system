import User from '../models/user.model.js';
import type { RegisterUserServiceData } from '../types/auth.type.js';
import ApiError from '../utils/apiError.js';
import { emailVerificationMailGenContent, sendEmail } from '../utils/mail.js';

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
