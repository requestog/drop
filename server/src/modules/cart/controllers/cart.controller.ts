import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CartCreateDto } from '../dto/cart-create.dto';
import { Cart } from '../models/cart.model';
import { CartDeleteDto } from '../dto/cart-delete.dto';
import { CartUpdateDto } from '../dto/cart-update.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Добавить товар в корзину',
    description:
      'Добавление нового товара в корзину пользователя. Требует ID товара, размера и количества.',
  })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно добавлен в корзину',
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован',
  })
  @ApiBody({ type: CartCreateDto })
  async add({ dto }: { dto: CartCreateDto }): Promise<void> {
    await this.cartService.add(dto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Получить содержимое корзины',
    description:
      'Получение полного списка товаров в корзине по ID пользователя.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Содержимое корзины',
    type: Cart,
  })
  @ApiResponse({
    status: 404,
    description: 'Корзина не найдена',
  })
  async get(@Param('id') id: string): Promise<Cart | null> {
    return await this.cartService.get(id);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Удалить товар из корзины',
    description:
      'Удаление конкретного товара из корзины пользователя по ID товара и размера.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно удален из корзины',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден в корзине',
  })
  @ApiBody({ type: CartDeleteDto })
  async delete(
    @Param('id') id: string,
    @Body() dto: CartDeleteDto,
  ): Promise<void> {
    await this.cartService.delete(id, dto);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Обновить количество товара в корзине',
    description:
      'Изменение количества выбранного товара в корзине пользователя.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Количество товара успешно обновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден в корзине',
  })
  @ApiBody({ type: CartUpdateDto })
  async update(
    @Param('id') id: string,
    @Body() dto: CartUpdateDto,
  ): Promise<void> {
    await this.cartService.updateCart(id, dto);
  }
}
