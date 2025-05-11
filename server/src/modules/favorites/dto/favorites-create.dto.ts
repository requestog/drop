import { IsNotEmpty, IsString } from 'class-validator';

export class FavoritesCreateDto {
  @IsNotEmpty({ message: 'Поле favorites не должно быть пустым' })
  @IsString({ message: 'Поле favorites должно быть строкой' })
  favorites: string;

  @IsNotEmpty({ message: 'Поле product не должно быть пустым' })
  @IsString({ message: 'Поле product должно быть строкой' })
  product: string;

  @IsNotEmpty({ message: 'Поле size не должно быть пустым' })
  @IsString({ message: 'Поле size должно быть строкой' })
  size: string;
}
