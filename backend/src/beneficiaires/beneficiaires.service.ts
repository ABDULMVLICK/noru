import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaireDto } from './dto/create-beneficiaire.dto';
import { UpdateBeneficiaireDto } from './dto/update-beneficiaire.dto';

@Injectable()
export class BeneficiairesService {
  constructor(private readonly prisma: PrismaService) {}

  create(utilisateurId: number, dto: CreateBeneficiaireDto) {
    return this.prisma.beneficiaire.create({
      data: { ...dto, utilisateurId },
    });
  }

  findAll(utilisateurId: number) {
    return this.prisma.beneficiaire.findMany({
      where: { utilisateurId },
      orderBy: { dateCreation: 'desc' },
    });
  }

  // Vérifie que le bénéficiaire existe ET appartient à l'utilisateur.
  // On renvoie "introuvable" (et pas "interdit") pour ne pas révéler son existence.
  async findOne(utilisateurId: number, id: number) {
    const beneficiaire = await this.prisma.beneficiaire.findUnique({
      where: { id },
    });
    if (!beneficiaire || beneficiaire.utilisateurId !== utilisateurId) {
      throw new NotFoundException('Bénéficiaire introuvable');
    }
    return beneficiaire;
  }

  async update(utilisateurId: number, id: number, dto: UpdateBeneficiaireDto) {
    await this.findOne(utilisateurId, id); // contrôle d'appartenance
    return this.prisma.beneficiaire.update({ where: { id }, data: dto });
  }

  async remove(utilisateurId: number, id: number) {
    await this.findOne(utilisateurId, id);
    await this.prisma.beneficiaire.delete({ where: { id } });
    return { message: 'Bénéficiaire supprimé' };
  }
}
