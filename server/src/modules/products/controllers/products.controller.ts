import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductCreateDto } from '../dto/product-create.dto';
import { Product } from '../models/product.model';
import { SearchProductsDto } from '../dto/search-products.dto';
import PaginatedProducts from '../interfaces/paginated-products.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @Body() body: { data: string },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Product> {
    const createProductDto = JSON.parse(body.data) as ProductCreateDto;
    return this.productsService.createProduct(createProductDto, images);
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

  @Delete('/:id')
  async deleteByID(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteByID(id);
  }
}
