import { IsNotEmpty, IsString } from 'class-validator';

export class ParentProductCreateDto {
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  name: string;
}
