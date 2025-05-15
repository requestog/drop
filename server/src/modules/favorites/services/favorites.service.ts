import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorites } from '../models/favorites';
import { Model, Types } from 'mongoose';
import { FavoriteItem } from '../models/favorite-item.model';
import { FavoritesDeleteDto } from '../dto/favorites-delete.dto';
import { FavoritesCreateDto } from '../dto/favorites-create.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorites.name)
    private readonly favoritesModel: Model<Favorites>,
    @InjectModel(FavoriteItem.name)
    private readonly favoriteItemModel: Model<FavoriteItem>,
  ) {}

  private readonly logger: Logger = new Logger('FavoritesService');

  async createFavorites(id: Types.ObjectId): Promise<void> {
    try {
      const product = new this.favoritesModel({
        user: id,
      });
      await product.save();
    } catch (error) {
      this.logger.error(
        `Failed to create Favorites: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create Favorites');
    }
  }

  async add(dto: FavoritesCreateDto): Promise<void> {
    try {
      const favorites = await this.favoritesModel.findById(
        new Types.ObjectId(dto.favorites),
      );

      if (!favorites) {
        throw new NotFoundException('Favorites not found');
      }

      const itemIndex: number = this.findItemIndex(favorites, dto);

      if (itemIndex >= 0) {
        throw new InternalServerErrorException('Item already exists');
      }

      const favoriteItem = new this.favoriteItemModel({
        product: new Types.ObjectId(dto.product),
        size: new Types.ObjectId(dto.size),
      });

      favorites.items.push(favoriteItem);
      await favorites.save();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to add product to favorites: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to add product to favorites',
      );
    }
  }

  async getFavorites(id: string): Promise<Favorites | null> {
    try {
      return await this.favoritesModel.findById(new Types.ObjectId(id));
    } catch (error) {
      this.logger.error(
        `Failed to get favorites: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get favorites');
    }
  }

  async delete(id: string, dto: FavoritesDeleteDto): Promise<void> {
    try {
      const favorites = await this.favoritesModel.findById(
        new Types.ObjectId(id),
      );
      if (!favorites) {
        throw new NotFoundException('Favorites not found');
      }

      const itemIndex: number = this.findItemIndex(favorites, dto);

      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in favorites');
      }

      favorites.items.splice(itemIndex, 1);
      await favorites.save();
    } catch (error) {
      this.logger.error(
        `Failed to delete a favorite: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete a favorite');
    }
  }

  private findItemIndex(favorites, dto): number {
    return favorites.items.findIndex(
      (item) =>
        item.product.equals(new Types.ObjectId(dto.product)) &&
        item.size.equals(new Types.ObjectId(dto.size)),
    );
  }
}
