import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IUser extends mongoose.Document {
  avatar: {
    url: string;
    localPath: string;
  };
  username: string;
  email: string;
  fullName?: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  refreshToken?: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): {
    unHashedToken: string;
    hashedToken: string;
    tokenExpiry: Date;
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: 'https://placehold.co/200x200',
        localPath: '',
      },
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
      required: [true, 'Email is required'],
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,

    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  // Hash the password when it changes.
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Compare the candidate with the stored hash.
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  // Generate a short-lived access token.
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15m',
    },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  // Generate a long-lived refresh token.
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  // Create a one-time token for email verification or password reset.
  // Store only the hash in the database so the raw token cannot be recovered.
  const unHashedToken = crypto.randomBytes(20).toString('hex');

  const hashedToken = crypto.createHash('sha256').update(unHashedToken).digest('hex');

  const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000);
  return { unHashedToken, hashedToken, tokenExpiry };
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
