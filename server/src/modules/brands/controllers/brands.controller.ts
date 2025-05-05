import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandsService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async createBrand(
    @Body() dto: BrandCreateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.brandService.createBrand(dto, image);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBrand(
    @Body() dto: BrandCreateDto,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.brandService.updateBrand(dto, id, image);
  }
}
