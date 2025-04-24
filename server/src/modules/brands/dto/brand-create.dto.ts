import { IsNotEmpty, IsString } from 'class-validator';

export class BrandCreateDto {
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;
  
  @IsString({ message: 'Изображение должно быть строкой (URL)' })
  img?: string;
}
