import { Request } from 'express';
import { AccountInfo } from './account-info.type';

export { AccountInfo } from './account-info.type';
export { TokenPayload } from './token-payload.type';

export interface AuthenticatedRequest extends Request {
  user: AccountInfo;
}
