import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class ParentProductCreateDto {
  @ApiProperty({ description: 'Название родительской категории продукта' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  name: string;

  @ApiProperty({ description: 'ID бренда (MongoDB ObjectId)' })
  @IsNotEmpty({ message: 'id бренда не должно быть пустым' })
  @IsMongoId()
  brand: Types.ObjectId;
}
