import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto): Promise<void> {
    await this.orderService.create(dto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOrders(@Param('id') id: string): Promise<Order[] | null> {
    return await this.orderService.getOrders(id);
  }
}
