import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../models/cart.model';
import { Model, Types } from 'mongoose';
import { CartItem } from '../models/cart-item.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartsModel: Model<Cart>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItem>,
  ) {}

  async createCart(id: Types.ObjectId): Promise<void> {
    try {
      const cart = new this.cartsModel({ user: id });
      await cart.save();
    } catch {
      throw new InternalServerErrorException('Failed to create cart');
    }
  }

  async add(dto) {
    try {
      const cart = await this.cartsModel.findById(
        new Types.ObjectId(dto.cartId),
      );

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const existingItem = cart.items.find(
        (item) =>
          item.product.equals(new Types.ObjectId(dto.product)) &&
          item.size.equals(new Types.ObjectId(dto.size)),
      );

      if (existingItem) {
        throw new InternalServerErrorException('Item already exists');
      }

      const cartItem = new this.cartItemModel({
        product: new Types.ObjectId(dto.product),
        quantity: dto.quantity,
        size: new Types.ObjectId(dto.size),
        price: dto.price,
      });

      cart.items.push(cartItem);
      cart.save();
    } catch (errors) {
      console.log(errors);
      throw new InternalServerErrorException('Failed to add cart');
    }
  }

  async get(id: string): Promise<Cart | null> {
    try {
      const cart = await this.cartsModel
        .findById(new Types.ObjectId(id))
        .exec();
      return cart ? cart : null;
    } catch {
      throw new InternalServerErrorException('Failed to get cart');
    }
  }

  async delete(id: string, dto) {
    try {
      const cart = await this.cartsModel
        .findById(new Types.ObjectId(id))
        .exec();

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.equals(new Types.ObjectId(dto.productId)) &&
          item.size.equals(new Types.ObjectId(dto.sizeId)),
      );

      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }

      cart.items.splice(itemIndex, 1);
      cart.save();
    } catch {
      throw new InternalServerErrorException('Failed to delete cart');
    }
  }
}
