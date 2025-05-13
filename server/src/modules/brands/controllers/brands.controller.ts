import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createBrand(
    @Body() dto: BrandCreateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.brandService.createBrand(dto, image);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateBrand(
    @Body() dto: BrandCreateDto,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.brandService.updateBrand(dto, id, image);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBrand(@Param('id') id: string): Promise<void> {
    await this.brandService.deleteBrand(id);
  }
}
