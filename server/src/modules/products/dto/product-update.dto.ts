import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdateDto {
  @ApiProperty({
    description: 'Новое название продукта (опционально)',
    maxLength: 255,
    required: false,
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(255, { message: 'Слишком длинное имя (макс. 255 символов)' })
  name?: string;

  @ApiProperty({
    description: 'Новое описание продукта (опционально)',
    maxLength: 500,
    required: false,
  })
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Слишком длинное описание (макс. 500 символов)' })
  description?: string;

  @ApiProperty({
    description: 'Новая цена продукта (опционально)',
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price?: number;

  @ApiProperty({
    description: 'Новый цвет продукта (опционально)',
    required: false,
  })
  @IsString({ each: true, message: 'Цвет должен быть строкой' })
  color?: string;

  @ApiProperty({
    description: 'Новые URL-адреса изображений продукта (опционально)',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Изображения должны быть массивом' })
  @IsString({
    each: true,
    message: 'Каждое изображение должно быть строкой (URL)',
  })
  images?: string[];

  @ApiProperty({
    description: 'Новое значение активности продукта (опционально)',
    required: false,
  })
  @IsBoolean({ message: 'Поле isActive должно быть булевым значением' })
  isActive?: boolean;

  @ApiProperty({
    description: 'Новая скидка на продукт в процентах (опционально)',
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Скидка должна быть числом' })
  @Min(0, { message: 'Скидка не может быть меньше 0%' })
  @Max(100, { message: 'Скидка не может быть больше 100%' })
  discount?: number;

  @ApiProperty({
    description: 'Новый ID бренда продукта (MongoDB ObjectId, опционально)',
    required: false,
  })
  @IsMongoId()
  brandId?: string;

  @ApiProperty({
    description:
      'Новый ID родительского продукта (MongoDB ObjectId, опционально)',
    required: false,
  })
  @IsMongoId()
  parentProductId?: string;

  @ApiProperty({
    description:
      'Новый массив ID категорий продукта (MongoDB ObjectIds, опционально)',
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((id) => new Types.ObjectId(id)))
  categories?: Types.ObjectId[];

  @ApiProperty({
    description: 'Массив URL-адресов изображений для удаления (опционально)',
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  imagesToDelete?: string[];
}
