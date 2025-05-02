import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductCreateDto } from '../dto/product-create.dto';
import { Product } from '../models/product.model';
import { SearchProductsDto } from '../dto/search-products.dto';
import PaginatedProducts from '../interfaces/paginated-products.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @Body() body: { data: string },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const rawData = JSON.parse(body.data);
    const createProductDto: ProductCreateDto = plainToClass(
      ProductCreateDto,
      rawData,
    );
    await this.productsService.createProduct(createProductDto, images);
  }

  @Post('search')
  async searchProducts(
    @Body() dto: SearchProductsDto,
  ): Promise<PaginatedProducts> {
    console.log(dto);
    return this.productsService.search(dto);
  }

  @Get('/getAll')
  async getAll(): Promise<Product[]> {
    return await this.productsService.getAll();
  }

  @Get('/:id')
  async getProductByID(@Param('id') id: string): Promise<Product | null> {
    return await this.productsService.getProductByID(id);
  }

  @Delete('delete/:id')
  async deleteByID(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct(id);
  }
}
