import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  async create(@Body() dto): Promise<void> {
    await this.orderService.create(dto);
  }
}
