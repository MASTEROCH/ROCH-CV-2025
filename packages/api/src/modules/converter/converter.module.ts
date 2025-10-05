import { Module } from '@nestjs/common';
import { ConverterService } from './converter.service';
import { ConverterController } from './converter.controller';
import { BalancesModule } from '../balances/balances.module';

@Module({
  imports: [BalancesModule],
  providers: [ConverterService],
  controllers: [ConverterController],
  exports: [ConverterService],
})
export class ConverterModule {}