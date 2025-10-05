import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get admin metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  async getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export data' })
  @ApiResponse({ status: 200, description: 'Data exported' })
  async exportData(@Query('format') format: 'json' | 'csv' = 'json') {
    return this.adminService.exportData(format);
  }

  @Post('roulette-config')
  @ApiOperation({ summary: 'Update roulette configuration' })
  @ApiResponse({ status: 200, description: 'Configuration updated' })
  async updateRouletteConfig(@Body() body: { segments: number; probabilities: Record<number, number> }) {
    return this.adminService.updateRouletteConfig(body.segments, body.probabilities);
  }

  @Post('shop-prices')
  @ApiOperation({ summary: 'Update shop prices' })
  @ApiResponse({ status: 200, description: 'Prices updated' })
  async updateShopPrices(@Body() body: { updates: Array<{ itemId: string; price: number }> }) {
    return this.adminService.updateShopPrices(body.updates);
  }
}