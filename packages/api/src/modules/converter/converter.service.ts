import { Injectable, BadRequestException } from '@nestjs/common';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class ConverterService {
  constructor(private balancesService: BalancesService) {}

  async convertCoinsToTickets(userId: string, amount: number) {
    const balance = await this.balancesService.getBalance(userId);
    const requiredCoins = amount * ECONOMY_CONFIG.CONVERSION.COINS_TO_TICKETS;

    if (balance.coins < requiredCoins) {
      throw new BadRequestException('Insufficient coins');
    }

    await this.balancesService.subtractCoins(userId, requiredCoins);
    await this.balancesService.addTickets(userId, amount);

    return {
      converted: amount,
      cost: requiredCoins,
      newBalance: await this.balancesService.getBalance(userId),
    };
  }

  async convertTicketsToCoins(userId: string, amount: number) {
    const balance = await this.balancesService.getBalance(userId);

    if (balance.tickets < amount) {
      throw new BadRequestException('Insufficient tickets');
    }

    const coinsToAdd = amount * ECONOMY_CONFIG.CONVERSION.TICKETS_TO_COINS;

    await this.balancesService.subtractTickets(userId, amount);
    await this.balancesService.addCoins(userId, coinsToAdd);

    return {
      converted: amount,
      received: coinsToAdd,
      newBalance: await this.balancesService.getBalance(userId),
    };
  }

  getConversionRates() {
    return {
      coinsToTickets: ECONOMY_CONFIG.CONVERSION.COINS_TO_TICKETS,
      ticketsToCoins: ECONOMY_CONFIG.CONVERSION.TICKETS_TO_COINS,
    };
  }
}