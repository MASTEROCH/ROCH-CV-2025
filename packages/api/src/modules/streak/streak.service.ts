import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class StreakService {
  constructor(
    private prisma: PrismaService,
    private balancesService: BalancesService,
  ) {}

  async getStreak(userId: string) {
    let streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await this.prisma.streak.create({
        data: {
          userId,
          count: 0,
        },
      });
    }

    return streak;
  }

  async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streak = await this.getStreak(userId);
    const lastDate = new Date(streak.lastDate);
    lastDate.setHours(0, 0, 0, 0);

    const isNewDay = today.getTime() > lastDate.getTime();
    const isConsecutive = today.getTime() - lastDate.getTime() === 24 * 60 * 60 * 1000;

    let newCount = 1;
    if (isConsecutive) {
      newCount = streak.count + 1;
    } else if (!isNewDay) {
      newCount = streak.count; // Same day, no change
    }

    const updatedStreak = await this.prisma.streak.update({
      where: { userId },
      data: {
        count: newCount,
        lastDate: today,
      },
    });

    // Award streak bonus
    if (isNewDay && (isConsecutive || streak.count === 0)) {
      const bonus = ECONOMY_CONFIG.REWARDS.STREAK_BONUS * Math.min(newCount, ECONOMY_CONFIG.STREAK.MAX_DAYS);
      await this.balancesService.addCoins(userId, bonus);
    }

    return updatedStreak;
  }
}