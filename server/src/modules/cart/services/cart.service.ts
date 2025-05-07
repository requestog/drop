import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../models/cart.model';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartsModel: Model<Cart>,
  ) {}
}
