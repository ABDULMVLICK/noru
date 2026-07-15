import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransfertsService } from './transferts.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UtilisateurConnecte } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('transferts')
export class TransfertsController {
  constructor(private readonly service: TransfertsService) {}

  @Post()
  create(
    @CurrentUser() user: UtilisateurConnecte,
    @Body() dto: CreateTransfertDto,
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

  // Enregistre le paiement mobile money du transfert.
  @Patch(':id/payer')
  payer(
    @CurrentUser() user: UtilisateurConnecte,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.payer(user.id, id);
  }
}
