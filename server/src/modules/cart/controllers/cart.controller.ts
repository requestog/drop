import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.model';
import { CartCreateDto } from '../dto/cart-create.dto';
import { CartDeleteDto } from '../dto/cart-delete.dto';
import { CartUpdateDto } from '../dto/cart-update.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async add(@Body() dto: CartCreateDto): Promise<void> {
    await this.cartService.add(dto);
  }

  @Get('/:id')
  async get(@Param('id') id: string): Promise<Cart | null> {
    return await this.cartService.get(id);
  }

  @Delete('/delete/:id')
  async delete(
    @Param('id') id: string,
    @Body() dto: CartDeleteDto,
  ): Promise<void> {
    await this.cartService.delete(id, dto);
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: CartUpdateDto,
  ): Promise<void> {
    await this.cartService.updateCart(id, dto);
  }
}
