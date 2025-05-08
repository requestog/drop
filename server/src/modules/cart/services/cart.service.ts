import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../models/cart.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartsModel: Model<Cart>,
  ) {}

  async createCart(id: Types.ObjectId): Promise<void> {
    try {
      const cart = new this.cartsModel({ user: id });
      await cart.save();
    } catch {
      throw new InternalServerErrorException('Failed to create cart');
    }
  }
}
