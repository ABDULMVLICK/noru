import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // INSCRIPTION : on hache le mot de passe avant de le stocker (jamais en clair).
  async register(dto: RegisterDto) {
    const existe = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (existe) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const motDePasseHache = await bcrypt.hash(dto.motDePasse, 10);
    const user = await this.prisma.utilisateur.create({
      data: {
        email: dto.email,
        motDePasse: motDePasseHache,
        nom: dto.nom,
        rgpdAccepte: dto.rgpdAccepte,
      },
    });

    return this.signerToken(user.id, user.email, user.role);
  }

  // CONNEXION : on compare le mot de passe fourni avec le hash stocké.
  async login(dto: LoginDto) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    // Message volontairement identique dans les deux cas pour ne pas révéler
    // si c'est l'email ou le mot de passe qui est faux (bonne pratique sécu).
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    const motDePasseOk = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!motDePasseOk) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.signerToken(user.id, user.email, user.role);
  }

  // RGPD — droit à l'effacement : supprime le compte et toutes ses données.
  // On supprime d'abord les transferts (clé étrangère), les bénéficiaires
  // étant supprimés en cascade avec l'utilisateur.
  async supprimerCompte(utilisateurId: number) {
    await this.prisma.$transaction([
      this.prisma.transfert.deleteMany({ where: { utilisateurId } }),
      this.prisma.utilisateur.delete({ where: { id: utilisateurId } }),
    ]);
    return { message: 'Compte et données supprimés' };
  }

  // Fabrique le JWT. Le "payload" est ce que le token transporte (jamais le mot de passe).
  private async signerToken(id: number, email: string, role: string) {
    const payload = { sub: id, email, role };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, utilisateur: { id, email, role } };
  }
}
