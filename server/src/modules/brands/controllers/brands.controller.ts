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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Brand } from '../models/brand.model';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Создание нового бренда' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Название бренда' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Логотип бренда (изображение)',
        },
      },
      required: ['name'],
    },
  })
  @ApiCreatedResponse({
    description: 'Бренд успешно создан',
    type: Brand,
  })
  async createBrand(
    @Body() dto: BrandCreateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.brandService.createBrand(dto, image);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Обновление информации о бренде' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID бренда для обновления',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Новое название бренда (опционально)',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Новый логотип бренда (изображение) (опционально)',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Информация о бренде успешно обновлена' })
  async updateBrand(
    @Body() dto: BrandCreateDto,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.brandService.updateBrand(dto, id, image);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление бренда по ID' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID бренда для удаления',
  })
  @ApiOkResponse({ description: 'Бренд успешно удален' })
  async deleteBrand(@Param('id') id: string): Promise<void> {
    await this.brandService.deleteBrand(id);
  }
}
