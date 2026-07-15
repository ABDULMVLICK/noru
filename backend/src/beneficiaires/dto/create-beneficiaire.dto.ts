import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class CreateBeneficiaireDto {
  @IsString()
  @MinLength(2, { message: 'Le nom complet est trop court' })
  nomComplet: string;

  @IsEmail({}, { message: "L'email du bénéficiaire n'est pas valide" })
  email: string;

  // Tant que le circuit bancaire n'est pas branché, on se limite à un contrôle
  // de longueur. La validation de la clé de contrôle de l'IBAN (@IsIBAN) sera
  // activée lors du raccordement au partenaire bancaire.
  @Length(14, 34, { message: "L'IBAN doit contenir entre 14 et 34 caractères" })
  iban: string;
}
