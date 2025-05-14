import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartUpdateDto {
  @ApiProperty({
    description: 'ID товара',
    example: '5f8d0f3d9d6b4a2f9c3e1d2a',
    required: true,
  })
  @IsNotEmpty({ message: 'Поле product не должно быть пустым' })
  @IsString({ message: 'Поле product должно быть строкой' })
  product: string;

  @ApiProperty({
    description: 'ID размера товара',
    example: '5f8d0f3d9d6b4a2f9c3e1d2b',
    required: true,
  })
  @IsNotEmpty({ message: 'Поле size не должно быть пустым' })
  @IsString({ message: 'Поле size должно быть строкой' })
  size: string;

  @ApiProperty({
    description: 'Новое количество товара',
    example: 3,
    minimum: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'Поле quantity не должно быть пустым' })
  @IsNumber({}, { message: 'Поле quantity должно быть числом' })
  quantity: number;
}
