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
import { Favorites } from '../models/favorites';
import { FavoritesCreateDto } from '../dto/favorites-create.dto';
import { FavoritesDeleteDto } from '../dto/favorites-delete.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(@Body() dto: FavoritesCreateDto): Promise<void> {
    await this.favoritesService.add(dto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Param('id') id: string,
    @Body() dto: FavoritesDeleteDto,
  ): Promise<void> {
    await this.favoritesService.delete(id, dto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Param('id') id: string): Promise<Favorites | null> {
    return await this.favoritesService.getFavorites(id);
  }
}
