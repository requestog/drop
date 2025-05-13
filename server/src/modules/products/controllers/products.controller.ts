import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductCreateDto } from '../dto/product-create.dto';
import { Product } from '../models/product.model';
import { SearchProductsDto } from '../dto/search-products.dto';
import PaginatedProducts from '../interfaces/paginated-products.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { ProductUpdateDto } from '../dto/product-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteByID(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      data: string;
    },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const rawData = JSON.parse(body.data);
    const productUpdateDto: ProductUpdateDto = plainToClass(
      ProductUpdateDto,
      rawData,
    );
    await this.productsService.updateProduct(id, productUpdateDto, images);
  }
}
