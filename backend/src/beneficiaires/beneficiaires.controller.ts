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
import { BeneficiairesService } from './beneficiaires.service';
import { CreateBeneficiaireDto } from './dto/create-beneficiaire.dto';
import { UpdateBeneficiaireDto } from './dto/update-beneficiaire.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UtilisateurConnecte } from '../auth/current-user.decorator';

// Toutes les routes de ce contrôleur exigent un JWT valide.
@UseGuards(JwtAuthGuard)
@Controller('beneficiaires')
export class BeneficiairesController {
  constructor(private readonly service: BeneficiairesService) {}

  @Post()
  create(
    @CurrentUser() user: UtilisateurConnecte,
    @Body() dto: CreateBeneficiaireDto,
  ) {
    return this.service.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: UtilisateurConnecte) {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: UtilisateurConnecte,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UtilisateurConnecte,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBeneficiaireDto,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: UtilisateurConnecte,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(user.id, id);
  }
}
