import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { Favorites } from '../models/favorites';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/add')
  async add(@Body() dto): Promise<void> {
    await this.favoritesService.add(dto);
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') id: string, @Body() dto): Promise<void> {
    await this.favoritesService.deleteOne(id, dto);
  }

  @Delete('/deleteAll/:id')
  async deleteAll(@Param('id') id: string): Promise<void> {
    await this.favoritesService.deleteAll(id);
  }

  @Get('/:id')
  async getFavorites(@Param('id') id: string): Promise<Favorites | null> {
    return await this.favoritesService.getFavorites(id);
  }
}
