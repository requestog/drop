import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../models/cart.model';
import { Model, Types } from 'mongoose';
import { CartItem } from '../models/cart-item.model';
import { CartCreateDto } from '../dto/cart-create.dto';
import { CartDeleteDto } from '../dto/cart-delete.dto';
import { CartUpdateDto } from '../dto/cart-update.dto';

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

  async add(dto: CartCreateDto): Promise<void> {
    try {
      const cart = await this.cartsModel.findById(new Types.ObjectId(dto.cart));

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const itemIndex: number = this.findItemIndex(cart, dto);

      if (itemIndex) {
        throw new InternalServerErrorException('Item already exists');
      }

      const cartItem = new this.cartItemModel({
        product: new Types.ObjectId(dto.product),
        quantity: dto.quantity,
        size: new Types.ObjectId(dto.size),
        price: dto.price,
      });

      cart.items.push(cartItem);
      await cart.save();
    } catch {
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

  async delete(id: string, dto: CartDeleteDto): Promise<void> {
    try {
      const cart = await this.cartsModel
        .findById(new Types.ObjectId(id))
        .exec();

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const itemIndex: number = this.findItemIndex(cart, dto);

      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }

      cart.items.splice(itemIndex, 1);
      await cart.save();
    } catch {
      throw new InternalServerErrorException('Failed to delete cart');
    }
  }

  async updateCart(id: string, dto: CartUpdateDto): Promise<void> {
    try {
      const cart = await this.cartsModel.findById(new Types.ObjectId(id));
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const itemIndex: number = this.findItemIndex(cart, dto);

      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }

      cart.items[itemIndex].quantity = dto.quantity;
      cart.save();
    } catch {
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  private findItemIndex(cart, dto: CartDeleteDto): number {
    return cart.items.findIndex(
      (item) =>
        item.product.equals(new Types.ObjectId(dto.product)) &&
        item.size.equals(new Types.ObjectId(dto.size)),
    );
  }
}
