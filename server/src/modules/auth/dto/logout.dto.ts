import { IsMongoId, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsMongoId({ message: 'Не валидный ID сессии' })
  @IsNotEmpty({ message: 'ID сессии не может быть пустым' })
  readonly sessionId: string;
}
