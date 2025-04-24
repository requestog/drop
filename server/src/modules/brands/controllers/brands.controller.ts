import { Body, Controller, Post } from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { BrandCreateDto } from '../dto/brand-create.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandsService) {}

  @Post('/create')
  async createBrand(@Body() dto: BrandCreateDto): Promise<void> {
    await this.brandService.createBrand(dto);
  }
}
