import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StreakService } from './streak.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('streak')
@Controller('streak')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get()
  @ApiOperation({ summary: 'Get user streak' })
  @ApiResponse({ status: 200, description: 'Streak retrieved' })
  async getStreak(@CurrentUser() user: any) {
    return this.streakService.getStreak(user.id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update user streak' })
  @ApiResponse({ status: 200, description: 'Streak updated' })
  async updateStreak(@CurrentUser() user: any) {
    return this.streakService.updateStreak(user.id);
  }
}