import { Module } from '@nestjs/common';
import { TransfertsService } from './transferts.service';
import { TransfertsController } from './transferts.controller';

@Module({
  controllers: [TransfertsController],
  providers: [TransfertsService],
})
export class TransfertsModule {}
