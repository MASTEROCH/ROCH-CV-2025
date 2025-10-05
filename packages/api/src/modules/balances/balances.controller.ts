import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BalancesService } from './balances.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('balances')
@Controller('balances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  async getBalance(@CurrentUser() user: any) {
    return this.balancesService.getBalance(user.id);
  }
}