import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private balancesService: BalancesService,
  ) {}

  async getFriends(userId: string) {
    return this.prisma.friend.findMany({
      where: { userId },
      include: {
        friend: {
          include: { balance: true },
        },
      },
    });
  }

  async addFriend(userId: string, friendTelegramId: string) {
    const friend = await this.prisma.user.findUnique({
      where: { telegramId: friendTelegramId },
    });

    if (!friend) {
      throw new NotFoundException('User not found');
    }

    if (friend.id === userId) {
      throw new BadRequestException('Cannot add yourself as friend');
    }

    // Check if already friends
    const existingFriendship = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId, friendId: friend.id },
          { userId: friend.id, friendId: userId },
        ],
      },
    });

    if (existingFriendship) {
      throw new BadRequestException('Already friends');
    }

    // Create friendship
    await this.prisma.friend.create({
      data: {
        userId,
        friendId: friend.id,
      },
    });

    // Award referral bonus
    await this.balancesService.addCoins(userId, ECONOMY_CONFIG.REWARDS.INVITE_FRIEND);

    return { message: 'Friend added successfully' };
  }

  async getReferralCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      referralCode: user.telegramId,
      referralLink: `https://t.me/your_bot?start=${user.telegramId}`,
    };
  }

  async getReferralStats(userId: string) {
    const referrals = await this.prisma.user.count({
      where: { referredById: userId },
    });

    return {
      totalReferrals: referrals,
      totalEarnings: referrals * ECONOMY_CONFIG.REWARDS.INVITE_FRIEND,
    };
  }
}