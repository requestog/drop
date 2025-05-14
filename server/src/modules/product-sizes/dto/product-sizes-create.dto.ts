import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductSizesCreateDto {
  @ApiProperty({ description: 'ID продукта (MongoDB ObjectId)' })
  @IsNotEmpty({ message: 'id не должно быть пустым' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Название размера продукта' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  size: string;

  @ApiProperty({ description: 'Количество данного размера в наличии' })
  @IsNotEmpty({ message: 'Количество не может быть пустым' })
  @IsNumber()
  count: number;
}
