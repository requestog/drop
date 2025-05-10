import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.model';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async add(@Body() dto): Promise<void> {
    await this.cartService.add(dto);
  }

  @Get('/:id')
  async get(@Param('id') id: string): Promise<Cart | null> {
    return await this.cartService.get(id);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string, @Body() dto): Promise<void> {
    await this.cartService.delete(id, dto);
  }
}
