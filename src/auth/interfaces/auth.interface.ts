import { Request } from 'express';

export interface OAuthRequest extends Request {
  user?: string;
}

export interface AccountPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}
