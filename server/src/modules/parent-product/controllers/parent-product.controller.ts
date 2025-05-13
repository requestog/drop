import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParentProductCreateDto } from '../dto/parent-product-create.dto';
import { ParentProductService } from '../services/parent-product.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('parent-product')
export class ParentProductController {
  constructor(private readonly parentProductService: ParentProductService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createParentProduct(
    @Body() dto: ParentProductCreateDto,
  ): Promise<void> {
    await this.parentProductService.createParentProduct(dto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteParentProduct(@Param('id') id: string): Promise<void> {
    await this.parentProductService.deleteParentProduct(id);
  }
}
