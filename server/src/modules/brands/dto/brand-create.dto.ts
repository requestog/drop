import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BrandCreateDto {
  @ApiProperty({ description: 'Название бренда' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @ApiProperty({
    description: 'Логотип бренда (изображение) - будет обработан как файл',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;
}
