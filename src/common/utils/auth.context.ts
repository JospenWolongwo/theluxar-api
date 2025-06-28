import * as dotenv from 'dotenv';
dotenv.config();

export const MAIN_URL = process.env.SITE_DOMAIN + ':' + process.env.PORT;

export const loginContext = (redirect: string | undefined, csrf: string) => {
  const loginUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/login`
      : `${MAIN_URL}/auth/login?redirect=${redirect}`;
  const googleAuthUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/google`
      : `${MAIN_URL}/auth/google?redirect=${redirect}`;
  const githubAuthUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/github`
      : `${MAIN_URL}/auth/github?redirect=${redirect}`;
  const signUpUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/signup`
      : `${MAIN_URL}/auth/signup?redirect=${redirect}`;
  const forgotPasswordUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/forgot-password`
      : `${MAIN_URL}/auth/forgot-password?redirect=${redirect}`;

  return {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue to your account',
    loginUrl,
    googleAuthUrl,
    githubAuthUrl,
    signUpUrl,
    forgotPasswordUrl,
    csrf,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const signupContext = (redirect: string | undefined, csrf: string) => {
  const signUpUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/signup`
      : `${MAIN_URL}/auth/signup?redirect=${redirect}`;
  const loginUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/login`
      : `${MAIN_URL}/auth/login?redirect=${redirect}`;

  return {
    title: 'Create an Account',
    subtitle: 'Join us and start your journey',
    signUpUrl,
    loginUrl,
    csrf,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const tokenDisplayContext = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => {
  return {
    title: 'Authentication Successful',
    subtitle: 'Here are your authentication tokens',
    tokens,
  };
};

export const signupConfirmationContext = (
  type:
    | 'signup'
    | 'activation'
    | 'resend'
    | 'error'
    | 'password-reset'
    | 'password-reset-success',
  loginUrl: string,
  resendUrl: string,
  email?: string,
  csrf?: string,
  errorMessage?: string,
) => {
  const messages = {
    signup: {
      title: 'Account Confirmation',
      subtitle: 'Thank you for joining Hello Identity',
      message:
        'Your account was successfully created. Please check your email and activate your account.',
    },
    activation: {
      title: 'Account Activated',
      subtitle: 'Your account is now ready to use',
      message: 'Your account was successfully activated!',
    },
    resend: {
      title: 'Email Resent',
      subtitle: 'Check your inbox',
      message: 'A new activation email has been sent. Please check your inbox.',
    },
    'password-reset': {
      title: 'Password Reset Requested',
      subtitle: 'Check your inbox',
      message:
        errorMessage ||
        'A password reset email has been sent to your inbox. Please check your email to reset your password.',
    },
    'password-reset-success': {
      title: 'Password Reset Successful',
      subtitle: 'Your password has been updated',
      message:
        errorMessage ||
        'Your password has been reset successfully. You can now log in with your new password.',
    },
    error: {
      title: 'Something Went Wrong',
      subtitle: "We couldn't process your request",
      message:
        errorMessage || 'An unexpected error occurred. Please try again.',
    },
  };
  return {
    ...messages[type],
    type,
    loginUrl,
    resendUrl,
    email,
    csrf,
  };
};

export const forgotPasswordContext = (
  redirect: string | undefined,
  csrf: string,
) => {
  const forgotPasswordUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/forgot-password`
      : `${MAIN_URL}/auth/forgot-password?redirect=${redirect}`;
  const loginUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/login`
      : `${MAIN_URL}/auth/login?redirect=${redirect}`;

  return {
    title: 'Forgot Password',
    subtitle: 'Enter your email to reset your password',
    forgotPasswordUrl,
    loginUrl,
    csrf,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const resetPasswordContext = (
  redirect: string | undefined,
  csrf: string,
  token: string,
) => {
  const resetPasswordUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/reset-password`
      : `${MAIN_URL}/auth/reset-password?redirect=${redirect}`;
  const loginUrl =
    redirect === undefined
      ? `${MAIN_URL}/auth/login`
      : `${MAIN_URL}/auth/login?redirect=${redirect}`;

  return {
    title: 'Reset Your Password',
    subtitle: 'Enter a new password for your account',
    resetPasswordUrl,
    loginUrl,
    token,
    csrf,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const headerContext = (activePage: string) => {
  return {
    logoUrl: '/images/theluxar-api-logo.svg',
    navLinks: [
      { url: '/auth/login', text: 'Login', active: activePage === 'login' },
      { url: '/auth/signup', text: 'Signup', active: activePage === 'signup' },
    ],
  };
};
