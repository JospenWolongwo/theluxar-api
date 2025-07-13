import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Generates the application's main URL based on environment variables
 * - In production: Uses full SITE_DOMAIN (assumes it includes protocol and any required port)
 * - In development: Constructs URL with protocol, domain, and port
 */
export const MAIN_URL = (() => {
  const isProduction = process.env.NODE_ENV === 'production';
  const siteDomain = process.env.SITE_DOMAIN || 'localhost';
  
  // For production environments, use the full domain without modifying it
  // This assumes SITE_DOMAIN in production includes protocol (https://)
  if (isProduction) {
    // Remove trailing slash if present
    return siteDomain.endsWith('/') ? siteDomain.slice(0, -1) : siteDomain;
  }
  
  // For local development, construct the full URL with port
  const protocol = 'http://';
  const port = process.env.PORT || '3000';
  
  // Don't add protocol if it's already included
  const base = siteDomain.startsWith('http') ? siteDomain : protocol + siteDomain;
  
  // Return base URL with port
  return `${base}:${port}`;
})();

export const loginContext = (redirect: string | undefined, csrf: string) => {
  // Use relative paths instead of full URLs
  const loginUrl =
    redirect === undefined
      ? `/auth/login`
      : `/auth/login?redirect=${redirect}`;
  const googleAuthUrl =
    redirect === undefined
      ? `/auth/google`
      : `/auth/google?redirect=${redirect}`;
  const facebookAuthUrl =
    redirect === undefined
      ? `/auth/facebook`
      : `/auth/facebook?redirect=${redirect}`;
  const signUpUrl =
    redirect === undefined
      ? `/auth/signup`
      : `/auth/signup?redirect=${redirect}`;
  const forgotPasswordUrl =
    redirect === undefined
      ? `/auth/forgot-password`
      : `/auth/forgot-password?redirect=${redirect}`;

  return {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue to your account',
    loginUrl,
    googleAuthUrl,
    facebookAuthUrl,
    signUpUrl,
    forgotPasswordUrl,
    csrf,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const signupContext = (redirect: string | undefined, csrf: string) => {
  // Use relative paths instead of full URLs
  const signUpUrl =
    redirect === undefined
      ? `/auth/signup`
      : `/auth/signup?redirect=${redirect}`;
  const loginUrl =
    redirect === undefined
      ? `/auth/login`
      : `/auth/login?redirect=${redirect}`;

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
  // Use relative paths instead of full URLs
  const forgotPasswordUrl =
    redirect === undefined
      ? `/auth/forgot-password`
      : `/auth/forgot-password?redirect=${redirect}`;
  const loginUrl =
    redirect === undefined
      ? `/auth/login`
      : `/auth/login?redirect=${redirect}`;

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
  // Use relative paths instead of full URLs
  const resetPasswordUrl =
    redirect === undefined
      ? `/auth/reset-password`
      : `/auth/reset-password?redirect=${redirect}`;
  const loginUrl =
    redirect === undefined
      ? `/auth/login`
      : `/auth/login?redirect=${redirect}`;

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
