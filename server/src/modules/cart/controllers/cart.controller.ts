import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from '../services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async add(@Body() dto): Promise<void> {
    await this.cartService.add(dto);
  }
}
