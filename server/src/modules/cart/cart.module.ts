import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './models/cart.model';
import { CartItem, CartItemSchema } from './models/cart-item.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  exports: [CartService],
})
export class CartModule {}
