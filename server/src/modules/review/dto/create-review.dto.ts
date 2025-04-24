import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Пользователь не указан' })
  userId: string;

  @IsInt({ message: 'Рейтинг должен быть целым числом' })
  @Min(1, { message: 'Минимальный рейтинг - 1' })
  @Max(5, { message: 'Максимальный рейтинг - 5' })
  rating: number;

  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsOptional()
  comment?: string;
}
