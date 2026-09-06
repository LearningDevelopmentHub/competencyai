import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>('roles', context.getHandler()) || [];
    if (required.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as any;
    if (!user || !user.id) return false;
    // user.roles array is expected
    const userRoles = (user.roles || []).map((r: any) => r.name);
    const ok = required.some(r => userRoles.includes(r));
    if (!ok) throw new ForbiddenException('Insufficient role');
    return ok;
  }
}
