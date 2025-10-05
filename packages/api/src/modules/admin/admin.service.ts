import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const totalUsers = await this.prisma.user.count();
    const totalSpins = await this.prisma.spin.count();
    const totalPurchases = await this.prisma.purchase.count();
    const totalRevenue = await this.prisma.purchase.aggregate({
      _sum: { totalCost: true },
    });

    const dailyStats = await this.prisma.spin.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    return {
      totalUsers,
      totalSpins,
      totalPurchases,
      totalRevenue: totalRevenue._sum.totalCost || 0,
      dailyStats,
    };
  }

  async exportData(format: 'json' | 'csv') {
    const users = await this.prisma.user.findMany({
      include: {
        balance: true,
        spins: true,
        purchases: true,
      },
    });

    if (format === 'json') {
      return users;
    }

    // CSV export
    const csvHeaders = [
      'id',
      'telegramId',
      'username',
      'firstName',
      'lastName',
      'coins',
      'tickets',
      'totalSpins',
      'totalPurchases',
      'createdAt',
    ];

    const csvRows = users.map(user => [
      user.id,
      user.telegramId,
      user.username || '',
      user.firstName || '',
      user.lastName || '',
      user.balance?.coins || 0,
      user.balance?.tickets || 0,
      user.balance?.totalSpins || 0,
      user.purchases.length,
      user.createdAt.toISOString(),
    ]);

    return {
      headers: csvHeaders,
      rows: csvRows,
    };
  }

  async updateRouletteConfig(segments: number, probabilities: Record<number, number>) {
    return this.prisma.rouletteConfig.upsert({
      where: { id: 'default' },
      update: {
        segments,
        probabilities,
      },
      create: {
        id: 'default',
        segments,
        probabilities,
      },
    });
  }

  async updateShopPrices(updates: Array<{ itemId: string; price: number }>) {
    const results = [];
    for (const update of updates) {
      const result = await this.prisma.shopItem.update({
        where: { id: update.itemId },
        data: { price: update.price },
      });
      results.push(result);
    }
    return results;
  }
}