import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  async create(@Body() dto): Promise<void> {
    await this.orderService.create(dto);
  }

  @Get('/:id')
  async getOrders(@Param('id') id: string): Promise<Order[] | null> {
    return await this.orderService.getOrders(id);
  }
}
