import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryCreateDto {
  @ApiProperty({ description: 'Название категории' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @ApiPropertyOptional({ description: 'Активна ли категория', default: true })
  @IsBoolean({ message: 'isActive должно быть булевым значением' })
  isActive?: boolean;
}
