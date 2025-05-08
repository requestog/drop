import {
  ConflictException,
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

      const cartItem = new this.cartItemModel({
        product: new Types.ObjectId(dto.product),
        quantity: dto.quantity,
        size: new Types.ObjectId(dto.size),
        price: dto.price,
      });

      console.log(cartItem);

      cart.items.push(cartItem);
      cart.save();
    } catch (errors) {
      console.log(errors);
      throw new InternalServerErrorException('Failed to add cart');
    }
  }
}
