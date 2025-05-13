import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order.model';
import { OrderItem, OrderItemSchema } from './models/order-item.model';
import {
  ProductSizes,
  ProductSizesSchema,
} from '../product-sizes/models/product-sizes.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: OrderItem.name, schema: OrderItemSchema },
    ]),
    MongooseModule.forFeature([
      { name: ProductSizes.name, schema: ProductSizesSchema },
    ]),
  ],
})
export class OrderModule {}
