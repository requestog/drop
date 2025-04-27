import { Body, Controller, Post } from '@nestjs/common';
import { ProductSizesService } from '../services/product-sizes.service';
import { ProductSizesCreateDto } from '../dto/product-sizes-create.dto';

@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @Post('/create')
  async createSize(@Body() dto: ProductSizesCreateDto) {
    await this.productSizesService.createSize(dto);
  }
}
