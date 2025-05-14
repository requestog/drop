import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductSizesUpdateDto {
  @ApiProperty({ description: 'Новое название размера продукта' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  size: string;

  @ApiProperty({ description: 'Новое количество данного размера в наличии' })
  @IsNotEmpty({ message: 'Количество не может быть пустым' })
  @IsNumber()
  count: number;
}
