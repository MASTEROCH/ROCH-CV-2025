import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private balancesService: BalancesService,
  ) {}

  async getShopItems() {
    return this.prisma.shopItem.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async purchaseItem(userId: string, itemId: string, quantity: number = 1) {
    const item = await this.prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (!item.isActive) {
      throw new BadRequestException('Item not available');
    }

    const totalCost = item.price * quantity;
    const balance = await this.balancesService.getBalance(userId);

    // Check if user has enough currency
    if (item.currency === 'COINS' && balance.coins < totalCost) {
      throw new BadRequestException('Insufficient coins');
    }

    // For TON and STARS, we'll implement mock payment
    if (item.currency === 'TON' || item.currency === 'STARS') {
      // Mock payment - in real implementation, integrate with TON/Stars payment
      console.log(`Mock payment: ${totalCost} ${item.currency} for user ${userId}`);
    }

    // Process the purchase
    if (item.currency === 'COINS') {
      await this.balancesService.subtractCoins(userId, totalCost);
    }

    // Add the purchased items
    if (item.type === 'COINS') {
      await this.balancesService.addCoins(userId, item.price * quantity);
    } else if (item.type === 'TICKETS') {
      await this.balancesService.addTickets(userId, quantity);
    } else if (item.type === 'STARTER_PACK') {
      // Starter pack: 1000 coins + 5 tickets
      await this.balancesService.addCoins(userId, 1000);
      await this.balancesService.addTickets(userId, 5);
    }

    // Record the purchase
    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        itemId,
        amount: quantity,
        totalCost,
      },
    });

    return {
      purchase,
      newBalance: await this.balancesService.getBalance(userId),
    };
  }

  async getPurchaseHistory(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}