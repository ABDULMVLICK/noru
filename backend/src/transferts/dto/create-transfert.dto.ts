import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CreateTransfertDto {
  @IsInt()
  @IsPositive()
  beneficiaireId: number;

  // Montant en FCFA. On borne pour éviter les valeurs absurdes.
  @IsNumber()
  @Min(500, { message: 'Le montant minimum est de 500 FCFA' })
  @Max(5000000, { message: 'Le montant maximum est de 5 000 000 FCFA' })
  montantFcfa: number;
}
