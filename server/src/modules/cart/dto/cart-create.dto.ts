import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartCreateDto {
  @IsNotEmpty()
  @IsString()
  cart: string;

  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
