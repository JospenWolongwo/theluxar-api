// src/modules/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailjetService } from 'nest-mailjet/dist/mailjet.service';
import { EmailTemplate, EmailTemplateName } from '../types/email-template.type';
import { accountActivationTemplate } from '../templates/account-activation.template';
import { passwordResetTemplate } from '../templates/password-reset.template';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailjetService) {}

  private templates: Record<EmailTemplateName, EmailTemplate> = {
    accountActivation: accountActivationTemplate,
    passwordReset: passwordResetTemplate,
  };

  async sendAccountActivationEmail(
    email: string,
    token: string,
    templateName: EmailTemplateName,
    redirect?: string,
  ) {
    try {
      console.log(`Sending activation email to: ${email}`);
      console.log(`Token: ${token}`);

      const template = this.templates[templateName];
      const result = await this.mailService.send({
        Messages: [
          {
            From: {
              Name: process.env.MAIL_SENDER_NAME || 'Hello Identity',
              Email: process.env.MAIL_SENDER,
            },
            To: [{ Email: email }],
            TextPart: template.text(token, redirect),
            HTMLPart: template.html(token, redirect),
            TemplateLanguage: true,
            Subject: template.subject,
          },
        ],
      });
      console.log('Email sent successfully', result);
      return result;
    } catch (error) {
      console.error('Email sending failed', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    templateName: EmailTemplateName,
    redirect?: string,
  ) {
    try {
      console.log(`Sending password reset email to: ${email}`);
      console.log(`Token: ${token}`);

      const template = this.templates[templateName];
      const result = await this.mailService.send({
        Messages: [
          {
            From: {
              Name: process.env.MAIL_SENDER_NAME || 'Hello Identity',
              Email: process.env.MAIL_SENDER,
            },
            To: [{ Email: email }],
            TextPart: template.text(token, redirect),
            HTMLPart: template.html(token, redirect),
            TemplateLanguage: true,
            Subject: template.subject,
          },
        ],
      });
      console.log('Password reset email sent successfully', result);
      return result;
    } catch (error) {
      console.error('Password reset email sending failed', error);
      throw error;
    }
  }
}
