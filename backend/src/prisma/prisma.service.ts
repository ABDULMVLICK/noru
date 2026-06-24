import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Ce service hérite de PrismaClient : c'est lui qui parle à MySQL.
// On l'injectera dans les autres services pour lire/écrire en base.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
