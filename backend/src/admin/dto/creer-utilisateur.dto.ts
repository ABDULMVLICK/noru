import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreerUtilisateurDto {
  @IsString()
  @MinLength(2, { message: 'Le nom est trop court' })
  nom: string;

  @IsEmail({}, { message: "L'email n'est pas valide" })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  motDePasse: string;

  @IsEnum(Role, { message: 'Rôle invalide' })
  role: Role;
}
