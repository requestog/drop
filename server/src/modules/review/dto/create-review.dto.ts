import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId({ message: 'Неверный ID род. продукта' })
  parentProductId: string;

  @IsMongoId({ message: 'Неверный ID продукта' })
  productId: string;

  @IsMongoId({ message: 'Неверный ID пользователя' })
  @IsNotEmpty()
  user: string;

  @IsInt({ message: 'Рейтинг должен быть целым числом' })
  @Min(1, { message: 'Минимальный рейтинг - 1' })
  @Max(5, { message: 'Максимальный рейтинг - 5' })
  rating: number;

  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsOptional()
  comment?: string;
}
