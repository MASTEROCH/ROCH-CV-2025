import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('shop')
@Controller('shop')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('items')
  @ApiOperation({ summary: 'Get shop items' })
  @ApiResponse({ status: 200, description: 'Shop items retrieved' })
  async getShopItems() {
    return this.shopService.getShopItems();
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Purchase an item' })
  @ApiResponse({ status: 200, description: 'Item purchased' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Insufficient funds or item not available' })
  async purchaseItem(@CurrentUser() user: any, @Body() body: { itemId: string; quantity?: number }) {
    return this.shopService.purchaseItem(user.id, body.itemId, body.quantity);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get purchase history' })
  @ApiResponse({ status: 200, description: 'Purchase history retrieved' })
  async getPurchaseHistory(@CurrentUser() user: any) {
    return this.shopService.getPurchaseHistory(user.id);
  }
}