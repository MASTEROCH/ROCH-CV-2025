import { Module } from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { RouletteController } from './roulette.controller';
import { BalancesModule } from '../balances/balances.module';

@Module({
  imports: [BalancesModule],
  providers: [RouletteService],
  controllers: [RouletteController],
  exports: [RouletteService],
})
export class RouletteModule {}