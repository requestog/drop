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

class PriceRange {
  @IsOptional()
  @IsNumber({}, { message: 'Минимальная цена должна быть числом' })
  min?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Максимальная цена должна быть числом' })
  max?: number;
}

class SortOptions {
  @IsOptional()
  @IsString({ message: 'Поле сортировки должно быть строкой' })
  field?: string;

  @IsOptional()
  @IsString({ message: 'Направление сортировки должно быть строкой' })
  @IsEnum(['asc', 'desc'], {
    message: 'Направление сортировки должно быть "asc" или "desc"',
  })
  order?: 'asc' | 'desc';
}

class Pagination {
  @IsOptional()
  @IsNumber({}, { message: 'Номер страницы должен быть числом' })
  @Min(1, { message: 'Номер страницы не может быть меньше 1' })
  page?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Min(1, { message: 'Лимит не может быть меньше 1' })
  @Max(100, { message: 'Лимит не может быть больше 100' })
  limit?: number;
}

export class SearchProductsDto {
  @IsOptional()
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  @MaxLength(500, {
    message: 'Поисковый запрос слишком длинный (макс. 500 символов)',
  })
  query?: string;

  @IsOptional()
  @IsArray({ message: 'Категории должны быть массивом' })
  @IsString({ each: true, message: 'Каждая категория должна быть строкой' })
  categories?: string[];

  @IsOptional()
  @IsArray({ message: 'Цвета должны быть массивом' })
  @IsString({ each: true, message: 'Каждый цвет должен быть строкой' })
  colors?: string[];

  @IsOptional()
  @ValidateNested()
  @Type((): typeof PriceRange => PriceRange)
  price?: PriceRange;

  @IsOptional()
  @IsArray({ message: 'Размеры должны быть массивом' })
  @IsString({ each: true, message: 'Каждый размер должен быть строкой' })
  sizes?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Минимальный рейтинг должен быть числом' })
  @Min(0, { message: 'Рейтинг не может быть меньше 0' })
  @Max(5, { message: 'Рейтинг не может быть больше 5' })
  averageRating?: number;

  @IsOptional()
  @IsBoolean({ message: 'Поле inStock должно быть булевым значением' })
  inStock?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type((): typeof SortOptions => SortOptions)
  sort?: SortOptions;

  @IsOptional()
  @ValidateNested()
  @Type((): typeof Pagination => Pagination)
  pagination?: Pagination;
}
