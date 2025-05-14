import { Product } from '../models/product.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedProductsResponseDto {
  @ApiProperty({ description: 'Массив найденных продуктов', type: [Product] })
  items: Product[];

  @ApiProperty({ description: 'Общее количество найденных элементов' })
  total: number;

  @ApiPropertyOptional({
    description: 'Текущая страница (опционально)',
    type: Number,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице (опционально)',
    type: Number,
  })
  limit?: number;
}
