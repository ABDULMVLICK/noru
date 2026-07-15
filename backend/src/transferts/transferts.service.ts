import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { FRAIS_POURCENT, TAUX_CHANGE_XOF_EUR } from './transfert.constants';

@Injectable()
export class TransfertsService {
  constructor(private readonly prisma: PrismaService) {}

  // Crée un transfert : on calcule les frais, le montant en euros, une référence
  // unique, et on démarre au statut EN_ATTENTE.
  async create(utilisateurId: number, dto: CreateTransfertDto) {
    // 1. Le bénéficiaire doit exister ET appartenir à l'utilisateur.
    const beneficiaire = await this.prisma.beneficiaire.findUnique({
      where: { id: dto.beneficiaireId },
    });
    if (!beneficiaire || beneficiaire.utilisateurId !== utilisateurId) {
      throw new NotFoundException('Bénéficiaire introuvable');
    }

    // 2. Calculs métier (arrondis à 2 décimales).
    const fraisFcfa = this.arrondir(dto.montantFcfa * FRAIS_POURCENT);
    const montantEur = this.arrondir(dto.montantFcfa / TAUX_CHANGE_XOF_EUR);

    // 3. Création en base.
    return this.prisma.transfert.create({
      data: {
        montantFcfa: dto.montantFcfa,
        fraisFcfa,
        montantEur,
        tauxChange: TAUX_CHANGE_XOF_EUR,
        reference: this.genererReference(),
        utilisateurId,
        beneficiaireId: dto.beneficiaireId,
      },
      include: { beneficiaire: true },
    });
  }

  findAll(utilisateurId: number) {
    return this.prisma.transfert.findMany({
      where: { utilisateurId },
      orderBy: { dateCreation: 'desc' },
      include: { beneficiaire: true },
    });
  }

  async findOne(utilisateurId: number, id: number) {
    const transfert = await this.prisma.transfert.findUnique({
      where: { id },
      include: { beneficiaire: true },
    });
    if (!transfert || transfert.utilisateurId !== utilisateurId) {
      throw new NotFoundException('Transfert introuvable');
    }
    return transfert;
  }

  // Paiement mobile money : EN_ATTENTE -> PAYE.
  // L'appel réel aux API opérateurs (MTN MoMo, Moov) sera branché ici une fois
  // l'agrément obtenu ; aujourd'hui on enregistre seulement le changement d'état.
  async payer(utilisateurId: number, id: number) {
    const transfert = await this.findOne(utilisateurId, id);
    if (transfert.statut !== 'EN_ATTENTE') {
      throw new BadRequestException(
        'Ce transfert ne peut plus être payé (déjà traité)',
      );
    }
    return this.prisma.transfert.update({
      where: { id },
      data: { statut: 'PAYE' },
      include: { beneficiaire: true },
    });
  }

  private arrondir(valeur: number): number {
    return Math.round(valeur * 100) / 100;
  }

  private genererReference(): string {
    return 'NORU-' + randomBytes(4).toString('hex').toUpperCase();
  }
}
