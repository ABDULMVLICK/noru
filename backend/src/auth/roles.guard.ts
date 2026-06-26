import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

// S'utilise APRÈS JwtAuthGuard (qui a déjà mis req.user).
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequis = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequis || rolesRequis.length === 0) {
      return true; // route non restreinte
    }
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    if (!request.user || !rolesRequis.includes(request.user.role ?? '')) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return true;
  }
}
