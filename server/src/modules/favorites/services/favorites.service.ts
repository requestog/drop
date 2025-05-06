import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorites } from '../models/favorites';
import { Model, Types } from 'mongoose';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorites.name)
    private readonly favoritesModel: Model<Favorites>,
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

      const productId = new Types.ObjectId(dto.product);

      if (favorites.products.some((p) => p.equals(productId))) {
        throw new ConflictException('Product already exists in favorites');
      }

      favorites.products.push(productId);
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

  async getFavorites(id: string) {
    try {
      return await this.favoritesModel.findById(id);
    } catch {
      throw new InternalServerErrorException('Failed to get favorites');
    }
  }

  async deleteOne(id: string, dto): Promise<void> {
    try {
      const result = await this.favoritesModel.findByIdAndUpdate(
        id,
        { $set: { products: new Types.ObjectId(dto.productId) } },
        { new: true },
      );
      if (!result) {
        throw new NotFoundException('Favorites not found');
      }
    } catch {
      throw new InternalServerErrorException('Failed to delete a favorite');
    }
  }

  async deleteAll(id: string): Promise<void> {
    try {
      await this.favoritesModel.findByIdAndDelete(new Types.ObjectId(id));
    } catch {
      throw new InternalServerErrorException('Failed to delete all favorites');
    }
  }
}
