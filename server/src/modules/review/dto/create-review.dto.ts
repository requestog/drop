import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID родительского продукта (MongoDB ObjectId)' })
  @IsMongoId({ message: 'Неверный ID род. продукта' })
  parentProductId: string;

  @ApiProperty({ description: 'ID продукта (MongoDB ObjectId)' })
  @IsMongoId({ message: 'Неверный ID продукта' })
  productId: string;

  @ApiProperty({
    description: 'ID пользователя, оставившего отзыв (MongoDB ObjectId)',
  })
  @IsMongoId({ message: 'Неверный ID пользователя' })
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'Рейтинг продукта (от 1 до 5)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'Рейтинг должен быть целым числом' })
  @Min(1, { message: 'Минимальный рейтинг - 1' })
  @Max(5, { message: 'Максимальный рейтинг - 5' })
  rating: number;

  @ApiProperty({
    description: 'Комментарий к отзыву (опционально)',
    required: false,
  })
  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsOptional()
  comment?: string;
}
