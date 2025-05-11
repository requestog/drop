import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { Favorites } from '../models/favorites';
import { FavoritesCreateDto } from '../dto/favorites-create.dto';
import { FavoritesDeleteDto } from '../dto/favorites-delete.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/add')
  async add(@Body() dto: FavoritesCreateDto): Promise<void> {
    await this.favoritesService.add(dto);
  }

  @Delete('delete/:id')
  async deleteOne(
    @Param('id') id: string,
    @Body() dto: FavoritesDeleteDto,
  ): Promise<void> {
    await this.favoritesService.delete(id, dto);
  }

  @Get('/:id')
  async getFavorites(@Param('id') id: string): Promise<Favorites | null> {
    return await this.favoritesService.getFavorites(id);
  }
}
