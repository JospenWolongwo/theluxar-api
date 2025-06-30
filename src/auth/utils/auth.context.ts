import { ForbiddenException } from '@nestjs/common';

export class AuthContext {
  /**
   * Get the authenticated user's ID from the request object
   */
  static getUserId(req: any): string {
    if (!req || !req.user || !req.user.sub) {
      throw new ForbiddenException('User not authenticated');
    }
    return req.user.sub;
  }

  /**
   * Check if the authenticated user has a specific role
   */
  static hasRole(req: any, role: string): boolean {
    if (!req || !req.user || !req.user.roles) {
      return false;
    }
    return req.user.roles.includes(role);
  }

  /**
   * Check if the authenticated user is the owner of a resource
   */
  static isResourceOwner(req: any, ownerId: string): boolean {
    const userId = this.getUserId(req);
    return userId === ownerId;
  }

  /**
   * Check if the user can access a particular resource
   * (either they own it or they are an admin)
   */
  static canAccessResource(req: any, ownerId: string): boolean {
    return this.isResourceOwner(req, ownerId) || this.hasRole(req, 'admin');
  }
}
