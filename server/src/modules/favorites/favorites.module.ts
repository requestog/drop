import { Module } from '@nestjs/common';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './services/favorites.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorites, FavoritesSchema } from './models/favorites';
import { FavoriteItem, FavoriteItemSchema } from './models/favorite-item.model';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [
    MongooseModule.forFeature([
      { name: Favorites.name, schema: FavoritesSchema },
    ]),
    MongooseModule.forFeature([
      { name: FavoriteItem.name, schema: FavoriteItemSchema },
    ]),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
