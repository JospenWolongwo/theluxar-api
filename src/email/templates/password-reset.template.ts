import { MAIN_URL } from '../../common/utils/auth.context';

export const passwordResetTemplate = {
  subject: `TheLuxar API: Password Reset`,
  text: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';
    return `You requested a password reset for your TheLuxar API account.
            Use the link below to reset your password.
            ${MAIN_URL}/auth/reset-password?token=${token}${redirectToken}
            If you didn't request this, please ignore this email.
        `;
  },
  html: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';
    const resetLink = `${MAIN_URL}/auth/reset-password?token=${token}${redirectToken}`;

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); padding: 40px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; font-size: 1.5rem;">Reset Your Password</h2>
            <p style="color: #666;">Click the button below to reset your password</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
            ">Reset Password</a>
          </div>
          
          <div style="color: #666; font-size: 14px; text-align: center;">
            <p>If the button doesn't work, copy and paste this link:</p>
            <p style="word-break: break-all;">${resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          &copy; 2025 TheLuxar API. All rights reserved.
        </div>
      </div>
    `;
  },
};
