import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class CreateBeneficiaireDto {
  @IsString()
  @MinLength(2, { message: 'Le nom complet est trop court' })
  nomComplet: string;

  @IsEmail({}, { message: "L'email du bénéficiaire n'est pas valide" })
  email: string;

  // NORU est une simulation : on accepte tout IBAN plausible (contrôle de
  // longueur). Dans une vraie application bancaire, on validerait la clé de
  // contrôle de l'IBAN avec @IsIBAN.
  @Length(14, 34, { message: "L'IBAN doit contenir entre 14 et 34 caractères" })
  iban: string;
}
