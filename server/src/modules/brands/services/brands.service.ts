import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from '../models/brand.model';
import { Model } from 'mongoose';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async createBrand(dto: BrandCreateDto): Promise<void> {
    try {
      const model = await new this.brandModel({ ...dto });
      await model.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
