import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ChangerStatutDto,
  StatutTransfertEnum,
} from './dto/changer-statut.dto';
import { CreerUtilisateurDto } from './dto/creer-utilisateur.dto';
import { ChangerRoleDto } from './dto/changer-role.dto';

// Champs renvoyés pour un utilisateur (jamais le mot de passe).
const CHAMPS_UTILISATEUR = {
  id: true,
  email: true,
  nom: true,
  role: true,
  dateCreation: true,
} as const;

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
      select: CHAMPS_UTILISATEUR,
      orderBy: { dateCreation: 'desc' },
    });
  }

  // Créer un utilisateur (le mot de passe est haché, comme à l'inscription).
  async creerUtilisateur(dto: CreerUtilisateurDto) {
    const existe = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (existe) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }
    const motDePasseHache = await bcrypt.hash(dto.motDePasse, 10);
    return this.prisma.utilisateur.create({
      data: {
        nom: dto.nom,
        email: dto.email,
        motDePasse: motDePasseHache,
        role: dto.role,
        rgpdAccepte: true,
      },
      select: CHAMPS_UTILISATEUR,
    });
  }

  // Changer le rôle d'un utilisateur (USER <-> ADMIN).
  async changerRole(id: number, dto: ChangerRoleDto) {
    const existe = await this.prisma.utilisateur.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return this.prisma.utilisateur.update({
      where: { id },
      data: { role: dto.role },
      select: CHAMPS_UTILISATEUR,
    });
  }

  // Supprimer un utilisateur et ses données. Un admin ne peut pas se supprimer.
  async supprimerUtilisateur(id: number, adminId: number) {
    if (id === adminId) {
      throw new BadRequestException(
        'Vous ne pouvez pas supprimer votre propre compte',
      );
    }
    const existe = await this.prisma.utilisateur.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    await this.prisma.$transaction([
      this.prisma.transfert.deleteMany({ where: { utilisateurId: id } }),
      this.prisma.utilisateur.delete({ where: { id } }),
    ]);
    return { message: 'Utilisateur supprimé' };
  }

  // Supprimer un transfert (opération).
  async supprimerTransfert(id: number) {
    const existe = await this.prisma.transfert.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Transfert introuvable');
    }
    await this.prisma.transfert.delete({ where: { id } });
    return { message: 'Transfert supprimé' };
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
