export interface RegisterUserServiceData {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserServiceData {
  identifier: string;
  password: string;
}

export interface ForgotPasswordRequestServiceData {
  email: string;
}

export interface ResetForgotPasswordServiceData {
  resetToken: string;
  password: string;
}

export interface ChangeCurrentPasswordServiceData {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
