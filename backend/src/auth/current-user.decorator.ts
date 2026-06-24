import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UtilisateurConnecte {
  id: number;
  email: string;
  role: string;
}

// Raccourci : @CurrentUser() me donne l'utilisateur déduit du JWT.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UtilisateurConnecte => {
    const request = ctx.switchToHttp().getRequest<{ user: UtilisateurConnecte }>();
    return request.user;
  },
);
