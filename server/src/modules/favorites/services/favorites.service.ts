import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorites } from '../models/favorites';
import { Model, Types } from 'mongoose';
import { FavoriteItem } from '../models/favorite-item.model';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorites.name)
    private readonly favoritesModel: Model<Favorites>,
    @InjectModel(FavoriteItem.name)
    private readonly favoriteItemModel: Model<FavoriteItem>,
  ) {}

  async createFavorites(id: Types.ObjectId): Promise<void> {
    try {
      const product = new this.favoritesModel({
        user: id,
      });
      await product.save();
    } catch {
      throw new InternalServerErrorException('Failed to create Favorites');
    }
  }

  async add(dto): Promise<void> {
    try {
      const favorites = await this.favoritesModel.findById(
        new Types.ObjectId(dto.favoritesId),
      );

      if (!favorites) {
        throw new NotFoundException('Favorites not found');
      }

      const itemIndex: number = this.findItemIndex(favorites, dto);

      if (itemIndex >= 0) {
        throw new InternalServerErrorException('Item already exists');
      }

      const favoriteItem = new this.favoriteItemModel({
        product: new Types.ObjectId(dto.productId),
        size: new Types.ObjectId(dto.sizeId),
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
      throw new InternalServerErrorException(
        'Failed to add product to favorites',
      );
    }
  }

  async getFavorites(id: string): Promise<Favorites | null> {
    try {
      return await this.favoritesModel.findById(new Types.ObjectId(id));
    } catch {
      throw new InternalServerErrorException('Failed to get favorites');
    }
  }

  async delete(id: string, dto): Promise<void> {
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
    } catch {
      throw new InternalServerErrorException('Failed to delete a favorite');
    }
  }

  private findItemIndex(favorites, dto): number {
    return favorites.items.findIndex(
      (item) =>
        item.product.equals(new Types.ObjectId(dto.productId)) &&
        item.size.equals(new Types.ObjectId(dto.sizeId)),
    );
  }
}
