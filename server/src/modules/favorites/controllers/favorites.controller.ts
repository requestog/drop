import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FavoritesCreateDto } from '../dto/favorites-create.dto';
import { FavoritesDeleteDto } from '../dto/favorites-delete.dto';
import { Favorites } from '../models/favorites';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить товар в избранное' })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно добавлен в избранное',
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован',
  })
  @ApiBody({ type: FavoritesCreateDto })
  async add(@Body() dto: FavoritesCreateDto): Promise<void> {
    await this.favoritesService.add(dto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удалить товар из избранного' })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно удален из избранного',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден в избранном',
  })
  @ApiBody({ type: FavoritesDeleteDto })
  async deleteOne(
    @Param('id') id: string,
    @Body() dto: FavoritesDeleteDto,
  ): Promise<void> {
    await this.favoritesService.delete(id, dto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить избранное пользователя' })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Список избранных товаров',
    type: Favorites,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  async getFavorites(@Param('id') id: string): Promise<Favorites | null> {
    return await this.favoritesService.getFavorites(id);
  }
}
