import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { balance: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { balance: true },
    });
  }

  async getLeaderboard(limit: number = 10) {
    return this.prisma.user.findMany({
      include: { balance: true },
      orderBy: { balance: { totalSpins: 'desc' } },
      take: limit,
    });
  }
}