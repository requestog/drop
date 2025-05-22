import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/order-create.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Создание нового заказа',
    description:
      'Создание нового заказа пользователем. Требует информации о товарах, количестве и данных доставки.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'Заказ успешно создан',
    type: Order,
  })
  async create(@Body() dto: CreateOrderDto): Promise<void> {
    await this.orderService.create(dto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Получение списка заказов пользователя по ID',
    description:
      'Получение истории всех заказов пользователя по его идентификатору. Возвращает список заказов с деталями.',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string', description: 'ID пользователя' })
  @ApiOkResponse({
    description: 'Список заказов пользователя',
    type: [Order],
  })
  async getOrders(@Param('id') id: string): Promise<Order[] | null> {
    return await this.orderService.getOrders(id);
  }
}
