import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id?: string;
    sub?: string;
    [key: string]: any;
  };
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractToken(request: Request): string | undefined {
    // First try to get token from Authorization header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }

    // If no Authorization header, try to get from HttpOnly cookie
    const cookieToken = request.cookies?.BAL_ess;
    if (cookieToken) {
      return cookieToken;
    }

    return undefined;
  }
}
