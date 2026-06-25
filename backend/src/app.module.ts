import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BeneficiairesModule } from './beneficiaires/beneficiaires.module';
import { TransfertsModule } from './transferts/transferts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Rend les variables du .env disponibles partout.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BeneficiairesModule,
    TransfertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
