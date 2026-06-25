import { IsEmail, IsIBAN, IsString, MinLength } from 'class-validator';

export class CreateBeneficiaireDto {
  @IsString()
  @MinLength(2, { message: 'Le nom complet est trop court' })
  nomComplet: string;

  @IsEmail({}, { message: "L'email du bénéficiaire n'est pas valide" })
  email: string;

  @IsIBAN(undefined, { message: "L'IBAN n'est pas valide" })
  iban: string;
}
