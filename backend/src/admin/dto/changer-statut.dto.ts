import { IsEnum } from 'class-validator';

export enum StatutTransfertEnum {
  EN_ATTENTE = 'EN_ATTENTE',
  PAYE = 'PAYE',
  ENVOYE = 'ENVOYE',
  RECU = 'RECU',
  ECHEC = 'ECHEC',
}

export class ChangerStatutDto {
  @IsEnum(StatutTransfertEnum, { message: 'Statut invalide' })
  statut: StatutTransfertEnum;
}
