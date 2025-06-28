// src/common/templates/account-activation.template.ts
import { MAIN_URL } from '../../common/utils/auth.context';

export const accountActivationTemplate = {
  subject: `TheLuxar API: Account Activation`,
  text: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';
    return `Thank you for signing up to TheLuxar API.
            Use the link below to activate your account.
            ${MAIN_URL}/auth/confirm-email?token=${token}${redirectToken}
        `;
  },
  html: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';
    const activationLink = `${MAIN_URL}/auth/confirm-email?token=${token}${redirectToken}`;

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); padding: 40px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; font-size: 1.5rem;">Activate Your Account</h2>
            <p style="color: #666;">Complete your registration by clicking the button below</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${activationLink}" style="
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
            ">Activate Account</a>
          </div>
          
          <div style="color: #666; font-size: 14px; text-align: center;">
            <p>If the button doesn't work, copy and paste this link:</p>
            <p style="word-break: break-all;">${activationLink}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          &copy; 2025 TheLuxar API. All rights reserved.
        </div>
      </div>
    `;
  },
};
