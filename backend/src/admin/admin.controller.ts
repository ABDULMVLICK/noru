import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ChangerStatutDto } from './dto/changer-statut.dto';
import { CreerUtilisateurDto } from './dto/creer-utilisateur.dto';
import { ChangerRoleDto } from './dto/changer-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UtilisateurConnecte } from '../auth/current-user.decorator';
import { NotificationsService } from '../notifications/notifications.service';

// Tout l'espace admin : il faut un JWT valide ET le rôle ADMIN.
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly notifications: NotificationsService,
  ) {}

  @Get('transferts')
  transferts() {
    return this.admin.findAllTransferts();
  }

  @Get('utilisateurs')
  utilisateurs() {
    return this.admin.findAllUtilisateurs();
  }

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('notifications')
  notifications_() {
    return this.notifications.findAll();
  }

  @Patch('transferts/:id/statut')
  changerStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangerStatutDto,
  ) {
    return this.admin.changerStatut(id, dto);
  }

  @Delete('transferts/:id')
  supprimerTransfert(@Param('id', ParseIntPipe) id: number) {
    return this.admin.supprimerTransfert(id);
  }

  @Post('utilisateurs')
  creerUtilisateur(@Body() dto: CreerUtilisateurDto) {
    return this.admin.creerUtilisateur(dto);
  }

  @Patch('utilisateurs/:id/role')
  changerRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangerRoleDto,
  ) {
    return this.admin.changerRole(id, dto);
  }

  @Delete('utilisateurs/:id')
  supprimerUtilisateur(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UtilisateurConnecte,
  ) {
    return this.admin.supprimerUtilisateur(id, user.id);
  }
}
