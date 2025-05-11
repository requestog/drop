import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ParentProductCreateDto } from '../dto/parent-product-create.dto';
import { ParentProductService } from '../services/parent-product.service';

@Controller('parent-product')
export class ParentProductController {
  constructor(private readonly parentProductService: ParentProductService) {}

  @Post('/create')
  async createParentProduct(
    @Body() dto: ParentProductCreateDto,
  ): Promise<void> {
    await this.parentProductService.createParentProduct(dto);
  }

  @Delete('/delete/:id')
  async deleteParentProduct(@Param('id') id: string): Promise<void> {
    await this.parentProductService.deleteParentProduct(id);
  }
}
