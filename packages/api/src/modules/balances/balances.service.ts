import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BalancesService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const balance = await this.prisma.balance.findUnique({
      where: { userId },
    });

    if (!balance) {
      // Create balance if it doesn't exist
      return this.prisma.balance.create({
        data: {
          userId,
          coins: 1000,
          tickets: 1,
        },
      });
    }

    return balance;
  }

  async updateBalance(userId: string, updates: {
    coins?: number;
    tickets?: number;
    tonGame?: number;
    totalSpins?: number;
  }) {
    return this.prisma.balance.upsert({
      where: { userId },
      update: updates,
      create: {
        userId,
        coins: updates.coins || 1000,
        tickets: updates.tickets || 1,
        tonGame: updates.tonGame || 0,
        totalSpins: updates.totalSpins || 0,
      },
    });
  }

  async addCoins(userId: string, amount: number) {
    const balance = await this.getBalance(userId);
    return this.updateBalance(userId, {
      coins: balance.coins + amount,
    });
  }

  async subtractCoins(userId: string, amount: number) {
    const balance = await this.getBalance(userId);
    if (balance.coins < amount) {
      throw new Error('Insufficient coins');
    }
    return this.updateBalance(userId, {
      coins: balance.coins - amount,
    });
  }

  async addTickets(userId: string, amount: number) {
    const balance = await this.getBalance(userId);
    return this.updateBalance(userId, {
      tickets: balance.tickets + amount,
    });
  }

  async subtractTickets(userId: string, amount: number) {
    const balance = await this.getBalance(userId);
    if (balance.tickets < amount) {
      throw new Error('Insufficient tickets');
    }
    return this.updateBalance(userId, {
      tickets: balance.tickets - amount,
    });
  }
}