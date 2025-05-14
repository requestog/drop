import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CartItemDto {
  @ApiProperty({ description: 'ID продукта (MongoDB ObjectId)' })
  @IsNotEmpty({ message: 'ID продукта не может быть пустым' })
  @IsMongoId()
  product: string;

  @ApiProperty({ description: 'Количество товара' })
  @IsNotEmpty({ message: 'Количество не может быть пустым' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Количество должно быть числом' },
  )
  count: number;

  @ApiProperty({ description: 'ID размера продукта (MongoDB ObjectId)' })
  @IsNotEmpty({ message: 'ID размера не может быть пустым' })
  @IsMongoId()
  size: string;

  @ApiProperty({ description: 'Цена товара в момент заказа' })
  @IsNotEmpty({ message: 'Цена не может быть пустой' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Цена должна быть числом' },
  )
  price: number;
}
