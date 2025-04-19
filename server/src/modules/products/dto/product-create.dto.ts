import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(255, { message: 'Слишком длинное имя (макс. 255 символов)' })
  name: string;

  @IsNotEmpty({ message: 'Описание не может быть пустым' })
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Слишком длинное описание (макс. 500 символов)' })
  description: string;

  @IsNotEmpty({ message: 'Цена не может быть пустой' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @IsNotEmpty({ message: 'Должен быть указан хотя бы один размер' })
  @IsArray({ message: 'Размеры должны быть массивом' })
  @IsString({ each: true, message: 'Каждый размер должен быть строкой' })
  sizes: string[];

  @IsNotEmpty({ message: 'Должен быть указан хотя бы один цвет' })
  @IsArray({ message: 'Цвета должны быть массивом' })
  @IsString({ each: true, message: 'Каждый цвет должен быть строкой' })
  colors: string[];

  @IsNotEmpty({ message: 'Должна быть указана хотя бы одна категория' })
  @IsArray({ message: 'Категории должны быть массивом' })
  @IsString({ each: true, message: 'Каждая категория должна быть строкой' })
  categories: string[];

  @IsOptional()
  @IsArray({ message: 'Изображения должны быть массивом' })
  @IsString({
    each: true,
    message: 'Каждое изображение должно быть строкой (URL)',
  })
  images?: string[];

  @IsBoolean({ message: 'Поле isActive должно быть булевым значением' })
  isActive: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Скидка должна быть числом' })
  @Min(0, { message: 'Скидка не может быть меньше 0%' })
  @Max(100, { message: 'Скидка не может быть больше 100%' })
  discount?: number;
}
