import { Injectable } from '@nestjs/common';
import { ParentProduct } from '../models/parent-product.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ParentProductCreateDto } from '../dto/parent-product-create.dto';

@Injectable()
export class ParentProductService {
  constructor(
    @InjectModel(ParentProduct.name)
    private readonly parentProductModel: Model<ParentProduct>,
  ) {}

  async createParentProduct(dto: ParentProductCreateDto) {
    await this.parentProductModel.create({ ...dto });
  }
}
