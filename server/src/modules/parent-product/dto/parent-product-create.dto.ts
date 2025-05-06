import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ParentProductCreateDto {
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  name: string;
  @IsNotEmpty({ message: 'id бренда не должно быть пустым' })
  @IsMongoId()
  brand: Types.ObjectId;
}
