import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FavoritesCreateDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty({ message: 'Поле favorites не должно быть пустым' })
  @IsString({ message: 'Поле favorites должно быть строкой' })
  favorites: string;

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
}
