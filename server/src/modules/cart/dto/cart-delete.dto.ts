import { IsNotEmpty, IsString } from 'class-validator';

export class CartDeleteDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsString()
  size: string;
}
