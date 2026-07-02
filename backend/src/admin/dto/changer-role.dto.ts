import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ChangerRoleDto {
  @IsEnum(Role, { message: 'Rôle invalide' })
  role: Role;
}
