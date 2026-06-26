import {
  IsBoolean,
  IsEmail,
  IsString,
  MinLength,
  Equals,
} from 'class-validator';

// Données attendues pour l'inscription. Chaque décorateur = une règle de validation.
export class RegisterDto {
  @IsEmail({}, { message: "L'email n'est pas valide" })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  motDePasse: string;

  @IsString()
  @MinLength(2, { message: 'Le nom est trop court' })
  nom: string;

  // Le consentement RGPD est obligatoire et doit valoir true.
  @IsBoolean()
  @Equals(true, {
    message: 'Vous devez accepter la politique de confidentialité (RGPD)',
  })
  rgpdAccepte: boolean;
}
