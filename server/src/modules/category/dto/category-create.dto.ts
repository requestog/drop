import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @IsBoolean({ message: 'isActive должно быть булевым значением' })
  isActive?: boolean;
}
