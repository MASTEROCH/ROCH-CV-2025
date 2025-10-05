import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private balancesService: BalancesService,
  ) {}

  async getFreeTicket(userId: string) {
    const now = new Date();
    const lastFreeTicket = await this.prisma.ticket.findFirst({
      where: {
        userId,
        type: 'FREE',
        claimedAt: {
          not: null,
        },
      },
      orderBy: { claimedAt: 'desc' },
    });

    if (lastFreeTicket) {
      const timeSinceLastClaim = now.getTime() - lastFreeTicket.claimedAt!.getTime();
      const cooldown = ECONOMY_CONFIG.ROULETTE.FREE_SPIN_COOLDOWN;

      if (timeSinceLastClaim < cooldown) {
        const remainingTime = cooldown - timeSinceLastClaim;
        throw new BadRequestException(`Free ticket available in ${Math.ceil(remainingTime / (1000 * 60 * 60))} hours`);
      }
    }

    // Create free ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        userId,
        type: 'FREE',
        amount: 1,
        claimedAt: now,
      },
    });

    // Add to balance
    await this.balancesService.addTickets(userId, 1);

    return ticket;
  }

  async getTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNextFreeTicketTime(userId: string) {
    const lastFreeTicket = await this.prisma.ticket.findFirst({
      where: {
        userId,
        type: 'FREE',
        claimedAt: {
          not: null,
        },
      },
      orderBy: { claimedAt: 'desc' },
    });

    if (!lastFreeTicket) {
      return null; // No previous free ticket, can claim now
    }

    const nextAvailableTime = new Date(
      lastFreeTicket.claimedAt!.getTime() + ECONOMY_CONFIG.ROULETTE.FREE_SPIN_COOLDOWN
    );

    return nextAvailableTime;
  }
}