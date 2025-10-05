import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class RouletteService {
  constructor(
    private prisma: PrismaService,
    private balancesService: BalancesService,
  ) {}

  async spin(userId: string, isAutoSpin: boolean = false) {
    // Check if user has tickets
    const balance = await this.balancesService.getBalance(userId);
    if (balance.tickets < 1) {
      throw new BadRequestException('No tickets available');
    }

    // Generate random result
    const result = Math.floor(Math.random() * ECONOMY_CONFIG.ROULETTE.SEGMENTS);
    
    // Determine if it's a win (simplified logic - every 3rd spin wins)
    const isWin = result % 3 === 0;
    const reward = isWin ? 100 : 0;

    // Update balance
    await this.balancesService.subtractTickets(userId, 1);
    if (isWin) {
      await this.balancesService.addCoins(userId, reward);
    }

    // Record the spin
    const spin = await this.prisma.spin.create({
      data: {
        userId,
        result,
        isWin,
        reward: isWin ? reward : null,
      },
    });

    // Update total spins count
    await this.balancesService.updateBalance(userId, {
      totalSpins: balance.totalSpins + 1,
    });

    return {
      spinId: spin.id,
      result,
      isWin,
      reward,
      newBalance: await this.balancesService.getBalance(userId),
    };
  }

  async getRouletteConfig() {
    const config = await this.prisma.rouletteConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return config || {
      segments: ECONOMY_CONFIG.ROULETTE.SEGMENTS,
      probabilities: {
        0: 0.125,
        1: 0.125,
        2: 0.125,
        3: 0.125,
        4: 0.125,
        5: 0.125,
        6: 0.125,
        7: 0.125,
      },
    };
  }

  async getSpinHistory(userId: string, limit: number = 10) {
    return this.prisma.spin.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getMoreChance(userId: string) {
    // This would implement the "more chance" feature
    // For now, just return a simple response
    return {
      available: true,
      cost: 50, // coins
      multiplier: 1.5,
    };
  }
}