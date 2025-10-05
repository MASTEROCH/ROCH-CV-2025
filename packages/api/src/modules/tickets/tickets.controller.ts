import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user tickets' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved' })
  async getTickets(@CurrentUser() user: any) {
    return this.ticketsService.getTickets(user.id);
  }

  @Post('claim-free')
  @ApiOperation({ summary: 'Claim free ticket' })
  @ApiResponse({ status: 200, description: 'Free ticket claimed' })
  @ApiResponse({ status: 400, description: 'Free ticket not available yet' })
  async claimFreeTicket(@CurrentUser() user: any) {
    return this.ticketsService.getFreeTicket(user.id);
  }

  @Get('next-free')
  @ApiOperation({ summary: 'Get next free ticket time' })
  @ApiResponse({ status: 200, description: 'Next free ticket time retrieved' })
  async getNextFreeTicketTime(@CurrentUser() user: any) {
    return this.ticketsService.getNextFreeTicketTime(user.id);
  }
}