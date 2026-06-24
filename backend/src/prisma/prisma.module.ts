import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() = PrismaService devient disponible partout sans le réimporter.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
