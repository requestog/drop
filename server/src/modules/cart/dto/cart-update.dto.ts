import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartUpdateDto {
  @IsNotEmpty({ message: 'Поле product не должно быть пустым' })
  @IsString({ message: 'Поле product должно быть строкой' })
  product: string;

  @IsNotEmpty({ message: 'Поле size не должно быть пустым' })
  @IsString({ message: 'Поле size должно быть строкой' })
  size: string;

  @IsNotEmpty({ message: 'Поле quantity не должно быть пустым' })
  @IsNumber({}, { message: 'Поле quantity должно быть числом' })
  quantity: number;
}
