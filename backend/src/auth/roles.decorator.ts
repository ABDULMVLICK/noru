import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// @Roles('ADMIN') sur une route = seuls les admins y accèdent.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
