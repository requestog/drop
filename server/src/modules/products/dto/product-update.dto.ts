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

export class ProductUpdateDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(255, { message: 'Слишком длинное имя (макс. 255 символов)' })
  name?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Слишком длинное описание (макс. 500 символов)' })
  description?: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price?: number;

  @IsString({ each: true, message: 'Цвет должен быть строкой' })
  color?: string;

  @IsOptional()
  @IsArray({ message: 'Изображения должны быть массивом' })
  @IsString({
    each: true,
    message: 'Каждое изображение должно быть строкой (URL)',
  })
  images?: string[];

  @IsBoolean({ message: 'Поле isActive должно быть булевым значением' })
  isActive?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Скидка должна быть числом' })
  @Min(0, { message: 'Скидка не может быть меньше 0%' })
  @Max(100, { message: 'Скидка не может быть больше 100%' })
  discount?: number;

  @IsMongoId()
  brandId?: string;

  @IsMongoId()
  parentProductId?: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((id) => new Types.ObjectId(id)))
  categories?: Types.ObjectId[];

  @IsArray()
  @IsString({ each: true })
  imagesToDelete?: string[];
}
