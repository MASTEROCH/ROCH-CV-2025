import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user friends' })
  @ApiResponse({ status: 200, description: 'Friends retrieved' })
  async getFriends(@CurrentUser() user: any) {
    return this.friendsService.getFriends(user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a friend' })
  @ApiResponse({ status: 200, description: 'Friend added' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async addFriend(@CurrentUser() user: any, @Body() body: { friendTelegramId: string }) {
    return this.friendsService.addFriend(user.id, body.friendTelegramId);
  }

  @Get('referral-code')
  @ApiOperation({ summary: 'Get referral code' })
  @ApiResponse({ status: 200, description: 'Referral code retrieved' })
  async getReferralCode(@CurrentUser() user: any) {
    return this.friendsService.getReferralCode(user.id);
  }

  @Get('referral-stats')
  @ApiOperation({ summary: 'Get referral statistics' })
  @ApiResponse({ status: 200, description: 'Referral stats retrieved' })
  async getReferralStats(@CurrentUser() user: any) {
    return this.friendsService.getReferralStats(user.id);
  }
}