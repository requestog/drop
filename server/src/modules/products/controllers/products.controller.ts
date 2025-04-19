import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductCreateDto } from '../dto/product-create.dto';
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

  @Get('/getAll')
  async getAll(): Promise<Product[]> {
    return await this.productsService.getAll();
  }

  @Get('/:id')
  async getProductByID(@Param('id') id: string): Promise<Product | null> {
    return await this.productsService.getProductByID(id);
  }

  @Delete('/:id')
  async deleteByID(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteByID(id);
  }
}
