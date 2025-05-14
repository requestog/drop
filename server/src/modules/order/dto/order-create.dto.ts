import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CartItemDto } from './cart-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID пользователя (MongoDB ObjectId)' })
  @IsNotEmpty({ message: 'ID пользователя не может быть пустым' })
  @IsMongoId()
  user: string;

  @ApiProperty({ description: 'Массив товаров в корзине', type: [CartItemDto] })
  @IsNotEmpty({ message: 'Корзина не может быть пустой' })
  @IsArray({ message: 'Корзина должна быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cart: CartItemDto[];
}
