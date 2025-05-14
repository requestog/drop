import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../models/user.model';
import { SafeUser } from '../types/user.types';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: SafeUser,
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидные данные',
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto): Promise<SafeUser> {
    return this.usersService.createUser(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован',
  })
  getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
