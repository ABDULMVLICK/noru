import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ChangerStatutDto,
  StatutTransfertEnum,
} from './dto/changer-statut.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // Tous les transferts (vue admin), avec l'envoyeur et le bénéficiaire.
  findAllTransferts() {
    return this.prisma.transfert.findMany({
      orderBy: { dateCreation: 'desc' },
      include: {
        beneficiaire: true,
        utilisateur: { select: { id: true, email: true, nom: true } },
      },
    });
  }

  // Tous les utilisateurs (sans le mot de passe).
  findAllUtilisateurs() {
    return this.prisma.utilisateur.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        dateCreation: true,
      },
      orderBy: { dateCreation: 'desc' },
    });
  }

  // Change le statut d'un transfert. Si RECU -> on notifie le receveur.
  async changerStatut(id: number, dto: ChangerStatutDto) {
    const existe = await this.prisma.transfert.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Transfert introuvable');
    }

    const transfert = await this.prisma.transfert.update({
      where: { id },
      data: { statut: dto.statut },
      include: { beneficiaire: true },
    });

    if (dto.statut === StatutTransfertEnum.RECU) {
      await this.notifications.notifierReception({
        destinataire: transfert.beneficiaire.email,
        nomReceveur: transfert.beneficiaire.nomComplet,
        montantEur: transfert.montantEur.toString(),
        reference: transfert.reference,
        transfertId: transfert.id,
      });
    }

    return transfert;
  }

  // Statistiques globales pour le tableau de bord admin.
  async stats() {
    const [nbTransferts, nbUtilisateurs, parStatut, sommes] = await Promise.all(
      [
        this.prisma.transfert.count(),
        this.prisma.utilisateur.count(),
        this.prisma.transfert.groupBy({ by: ['statut'], _count: true }),
        this.prisma.transfert.aggregate({
          _sum: { montantEur: true, montantFcfa: true },
        }),
      ],
    );

    return {
      nbTransferts,
      nbUtilisateurs,
      parStatut,
      volumeTotalEur: sommes._sum.montantEur ?? 0,
      volumeTotalFcfa: sommes._sum.montantFcfa ?? 0,
    };
  }
}
