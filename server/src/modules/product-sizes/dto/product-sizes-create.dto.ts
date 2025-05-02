import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductSizesCreateDto {
  @IsNotEmpty({ message: 'id не должно быть пустым' })
  @IsMongoId()
  productId: string;

  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  size: string;

  @IsNotEmpty({ message: 'Количество не может быть пустым' })
  @IsNumber()
  count: number;
}
