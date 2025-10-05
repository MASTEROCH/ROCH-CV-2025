import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RouletteService } from './roulette.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('roulette')
@Controller('roulette')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @Post('spin')
  @ApiOperation({ summary: 'Spin the roulette' })
  @ApiResponse({ status: 200, description: 'Spin completed' })
  @ApiResponse({ status: 400, description: 'No tickets available' })
  async spin(@CurrentUser() user: any, @Body() body: { isAutoSpin?: boolean }) {
    return this.rouletteService.spin(user.id, body.isAutoSpin);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get roulette configuration' })
  @ApiResponse({ status: 200, description: 'Configuration retrieved' })
  async getConfig() {
    return this.rouletteService.getRouletteConfig();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get spin history' })
  @ApiResponse({ status: 200, description: 'History retrieved' })
  async getHistory(@CurrentUser() user: any, @Query('limit') limit?: number) {
    return this.rouletteService.getSpinHistory(user.id, limit);
  }

  @Get('more-chance')
  @ApiOperation({ summary: 'Get more chance options' })
  @ApiResponse({ status: 200, description: 'More chance options retrieved' })
  async getMoreChance(@CurrentUser() user: any) {
    return this.rouletteService.getMoreChance(user.id);
  }
}