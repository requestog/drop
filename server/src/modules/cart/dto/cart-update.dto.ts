import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartUpdateDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
