import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

class PriceRange {
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;
}

class RatingFilter {
  @IsOptional()
  @IsNumber()
  min?: number;
}

class SortOptions {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}

class Pagination {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsArray()
  colors?: string[];

  @IsOptional()
  price?: PriceRange;

  @IsOptional()
  @IsArray()
  sizes?: string[];

  @IsOptional()
  rating?: RatingFilter;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  sort?: SortOptions;

  @IsOptional()
  pagination?: Pagination;
}
