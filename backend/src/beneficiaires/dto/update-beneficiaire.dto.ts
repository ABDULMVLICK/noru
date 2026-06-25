import { IsEmail, IsIBAN, IsOptional, IsString, MinLength } from 'class-validator';

// Tous les champs optionnels : on peut modifier seulement ce qu'on veut.
export class UpdateBeneficiaireDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nomComplet?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIBAN()
  iban?: string;
}
