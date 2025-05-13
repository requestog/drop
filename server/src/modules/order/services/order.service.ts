import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../models/order.model';
import { Model, Types } from 'mongoose';
import { OrderItem } from '../models/order-item.model';
import { ProductSizes } from '../../product-sizes/models/product-sizes.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectModel(ProductSizes.name)
    private productSizesModel: Model<ProductSizes>,
  ) {}

  private readonly logger: Logger = new Logger('OrderService');

  async create(dto): Promise<void> {
    try {
      const total: number = dto.cart.reduce(
        (sum: number, item): number => sum + item.price * item.count,
        0,
      );
      const order = new this.orderModel({
        user: dto.user,
        items: dto.cart.map(
          (item) =>
            new this.orderItemModel({
              product: new Types.ObjectId(item.product),
              size: new Types.ObjectId(item.size),
              count: item.count,
            }),
        ),
        total,
        status: 'completed',
      });

      await order.save();
      await Promise.all(
        dto.cart.map(async (cartItem): Promise<void> => {
          try {
            const size = await this.productSizesModel.findById(
              new Types.ObjectId(cartItem.size),
            );

            if (!size) {
              this.logger.error(`Size with id ${cartItem.size} not found`);
              return;
            }

            if (size.count < cartItem.count) {
              this.logger.error(
                `Not enough items in stock for size ${size._id}`,
              );
              throw new Error(`Not enough items in stock for size ${size._id}`);
            }

            size.count -= cartItem.count;
            await size.save();
          } catch (error) {
            this.logger.error(
              `Error processing cart item ${cartItem.size}:`,
              error.message,
            );
            throw error;
          }
        }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to create order for user ${dto.user}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error creating Order');
    }
  }
}
