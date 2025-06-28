// src/common/types/email-template.type.ts
export type template = {
  subject: string;
  text: (...args: any[]) => string;
  html: (...args: any[]) => string;
};

export type EmailTemplate = template;

export type EmailTemplateName = 'accountActivation' | 'passwordReset';
