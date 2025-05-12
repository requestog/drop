import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../models/order.model';
import { Model, Types } from 'mongoose';
import { OrderItem } from '../models/order-item.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
  ) {}

  async create(dto): Promise<void> {
    try {
      const total: number = dto.cart.reduce(
        (sum: number, item): number => sum + item.price * item.quantity,
        0,
      );
      const order = new this.orderModel({
        user: dto.user,
        items: dto.cart.map(
          (item) =>
            new this.orderItemModel({
              product: new Types.ObjectId(item.product),
              size: new Types.ObjectId(item.size),
              quantity: item.quantity,
            }),
        ),
        total,
        status: 'completed',
      });

      await order.save();
    } catch {
      throw new InternalServerErrorException('Error creating Order');
    }
  }
}
