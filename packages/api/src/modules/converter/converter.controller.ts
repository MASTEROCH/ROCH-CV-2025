import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConverterService } from './converter.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('converter')
@Controller('converter')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get conversion rates' })
  @ApiResponse({ status: 200, description: 'Conversion rates retrieved' })
  async getConversionRates() {
    return this.converterService.getConversionRates();
  }

  @Post('coins-to-tickets')
  @ApiOperation({ summary: 'Convert coins to tickets' })
  @ApiResponse({ status: 200, description: 'Conversion successful' })
  @ApiResponse({ status: 400, description: 'Insufficient coins' })
  async convertCoinsToTickets(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.converterService.convertCoinsToTickets(user.id, body.amount);
  }

  @Post('tickets-to-coins')
  @ApiOperation({ summary: 'Convert tickets to coins' })
  @ApiResponse({ status: 200, description: 'Conversion successful' })
  @ApiResponse({ status: 400, description: 'Insufficient tickets' })
  async convertTicketsToCoins(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.converterService.convertTicketsToCoins(user.id, body.amount);
  }
}