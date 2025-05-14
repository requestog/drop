import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
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

export class ProductCreateDto {
  @ApiProperty({ description: 'Название продукта', maxLength: 255 })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(255, { message: 'Слишком длинное имя (макс. 255 символов)' })
  name: string;

  @ApiProperty({ description: 'Описание продукта', maxLength: 500 })
  @IsNotEmpty({ message: 'Описание не может быть пустым' })
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Слишком длинное описание (макс. 500 символов)' })
  description: string;

  @ApiProperty({ description: 'Цена продукта', minimum: 0 })
  @IsNotEmpty({ message: 'Цена не может быть пустой' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @ApiProperty({ description: 'Цвет продукта' })
  @IsNotEmpty({ message: 'Должен быть указан хотя бы один цвет' })
  @IsString({ each: true, message: 'Цвет должен быть строкой' })
  color: string;

  @ApiProperty({
    description: 'URL-адреса изображений продукта',
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
    description: 'Активен ли продукт по умолчанию',
    default: true,
  })
  @IsBoolean({ message: 'Поле isActive должно быть булевым значением' })
  isActive: boolean;

  @ApiProperty({
    description: 'Скидка на продукт в процентах',
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Скидка должна быть числом' })
  @Min(0, { message: 'Скидка не может быть меньше 0%' })
  @Max(100, { message: 'Скидка не может быть больше 100%' })
  discount?: number;

  @ApiProperty({ description: 'ID бренда продукта (MongoDB ObjectId)' })
  @IsNotEmpty()
  @IsMongoId()
  brandId: string;

  @ApiProperty({ description: 'ID родительского продукта (MongoDB ObjectId)' })
  @IsNotEmpty()
  @IsMongoId()
  parentProductId: string;

  @ApiProperty({
    description: 'Массив ID категорий продукта (MongoDB ObjectIds)',
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((id) => new Types.ObjectId(id)))
  categories?: Types.ObjectId[];
}
