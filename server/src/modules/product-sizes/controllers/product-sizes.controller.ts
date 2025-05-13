import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductSizesService } from '../services/product-sizes.service';
import { ProductSizesCreateDto } from '../dto/product-sizes-create.dto';
import { ProductSizesUpdateDto } from '../dto/product-sizes-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createSize(@Body() dto: ProductSizesCreateDto): Promise<void> {
    await this.productSizesService.createSize(dto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSize(@Param('id') id: string): Promise<void> {
    await this.productSizesService.deleteSize(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  async updateSize(
    @Param('id') id: string,
    @Body() dto: ProductSizesUpdateDto,
  ): Promise<void> {
    await this.productSizesService.updateSize(id, dto);
  }
}
