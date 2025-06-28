import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AccountInfo } from '../../auth/types';
import type { Permission } from '../../user-permission/utils';
import { AuthenticatedRequest } from '../../auth/types';
import { PERMISSIONS_KEY } from '../decorators/requirePermissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return requiredPermissions.every((permission) =>
      (<AccountInfo>user).permissions?.includes(permission),
    );
  }
}
