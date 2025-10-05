import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BalancesModule } from './modules/balances/balances.module';
import { RouletteModule } from './modules/roulette/roulette.module';
import { StreakModule } from './modules/streak/streak.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { FriendsModule } from './modules/friends/friends.module';
import { ShopModule } from './modules/shop/shop.module';
import { ConverterModule } from './modules/converter/converter.module';
import { AdminModule } from './modules/admin/admin.module';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    BalancesModule,
    RouletteModule,
    StreakModule,
    TicketsModule,
    TasksModule,
    FriendsModule,
    ShopModule,
    ConverterModule,
    AdminModule,
  ],
})
export class AppModule {}