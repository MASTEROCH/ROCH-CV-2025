import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TelegramService } from './telegram.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private telegramService: TelegramService,
  ) {}

  async validateTelegramData(loginDto: LoginDto) {
    const isValid = await this.telegramService.validateInitData(loginDto.initData);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram data');
    }

    const userData = this.telegramService.parseInitData(loginDto.initData);
    return this.findOrCreateUser(userData);
  }

  async findOrCreateUser(userData: any) {
    let user = await this.prisma.user.findUnique({
      where: { telegramId: userData.id.toString() },
      include: { balance: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId: userData.id.toString(),
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          languageCode: userData.language_code,
          balance: {
            create: {
              coins: 1000, // Starting coins
              tickets: 1,   // Starting ticket
            },
          },
        },
        include: { balance: true },
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, telegramId: user.telegramId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
      },
    };
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { balance: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}