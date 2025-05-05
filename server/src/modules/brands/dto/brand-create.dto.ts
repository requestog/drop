import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BrandCreateDto {
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @IsOptional()
  image?: any;
}
