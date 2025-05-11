import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartCreateDto {
  @IsNotEmpty({ message: 'Поле cart не должно быть пустым' })
  @IsString({ message: 'Поле cart должно быть строкой' })
  cart: string;

  @IsNotEmpty({ message: 'Поле product не должно быть пустым' })
  @IsString({ message: 'Поле product должно быть строкой' })
  product: string;

  @IsNotEmpty({ message: 'Поле quantity не должно быть пустым' })
  @IsNumber({}, { message: 'Поле quantity должно быть числом' })
  quantity: number;

  @IsNotEmpty({ message: 'Поле size не должно быть пустым' })
  @IsString({ message: 'Поле size должно быть строкой' })
  size: string;

  @IsNotEmpty({ message: 'Поле price не должно быть пустым' })
  @IsNumber({}, { message: 'Поле price должно быть числом' })
  price: number;
}
