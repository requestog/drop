import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsEnum,
  ValidateNested,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PriceRange {
  @ApiPropertyOptional({ description: 'Минимальная цена', type: Number })
  @IsOptional()
  @IsNumber({}, { message: 'Минимальная цена должна быть числом' })
  min?: number;

  @ApiPropertyOptional({ description: 'Максимальная цена', type: Number })
  @IsOptional()
  @IsNumber({}, { message: 'Максимальная цена должна быть числом' })
  max?: number;
}

class SortOptions {
  @ApiPropertyOptional({ description: 'Поле для сортировки', type: String })
  @IsOptional()
  @IsString({ message: 'Поле сортировки должно быть строкой' })
  field?: string;

  @ApiPropertyOptional({
    description: 'Направление сортировки ("asc" или "desc")',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString({ message: 'Направление сортировки должно быть строкой' })
  @IsEnum(['asc', 'desc'], {
    message: 'Направление сортировки должно быть "asc" или "desc"',
  })
  order?: 'asc' | 'desc';
}

class Pagination {
  @ApiPropertyOptional({
    description: 'Номер страницы',
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Номер страницы должен быть числом' })
  @Min(1, { message: 'Номер страницы не может быть меньше 1' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    type: Number,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Min(1, { message: 'Лимит не может быть меньше 1' })
  @Max(100, { message: 'Лимит не может быть больше 100' })
  limit?: number;
}

export class SearchProductsDto {
  @ApiPropertyOptional({
    description: 'Поисковый запрос по названию и описанию',
    type: String,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  @MaxLength(500, {
    message: 'Поисковый запрос слишком длинный (макс. 500 символов)',
  })
  query?: string;

  @ApiPropertyOptional({
    description: 'Массив ID категорий для фильтрации',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Категории должны быть массивом' })
  @IsString({ each: true, message: 'Каждая категория должна быть строкой' })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Цвет для фильтрации', type: String })
  @IsOptional()
  @IsString({ each: true, message: 'Цвет должен быть строкой' })
  color?: string;

  @ApiPropertyOptional({
    description: 'Диапазон цен для фильтрации',
    type: PriceRange,
  })
  @IsOptional()
  @ValidateNested()
  @Type((): typeof PriceRange => PriceRange)
  price?: PriceRange;

  @ApiPropertyOptional({
    description: 'Массив размеров для фильтрации',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Размеры должны быть массивом' })
  @IsString({ each: true, message: 'Каждый размер должен быть строкой' })
  sizes?: string[];

  @ApiPropertyOptional({
    description: 'Минимальный средний рейтинг для фильтрации',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Минимальный рейтинг должен быть числом' })
  @Min(0, { message: 'Рейтинг не может быть меньше 0' })
  @Max(5, { message: 'Рейтинг не может быть больше 5' })
  averageRating?: number;

  @ApiPropertyOptional({
    description: 'Фильтр по наличию на складе',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'Поле inStock должно быть булевым значением' })
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'ID бренда для фильтрации',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Поле brandId должно быть строковым значением' })
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Параметры сортировки',
    type: SortOptions,
  })
  @IsOptional()
  @ValidateNested()
  @Type((): typeof SortOptions => SortOptions)
  sort?: SortOptions;

  @ApiPropertyOptional({ description: 'Параметры пагинации', type: Pagination })
  @IsOptional()
  @ValidateNested()
  @Type((): typeof Pagination => Pagination)
  pagination?: Pagination;
}
