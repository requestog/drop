import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductCreateDto } from '../dto/product.create.dto';
import { Product } from '../models/product.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  async createProduct(
    @Body() createProductDto: ProductCreateDto,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }
}
