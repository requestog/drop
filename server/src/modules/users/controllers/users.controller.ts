import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../models/user.model';
import { SafeUser } from '../types/user.types';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddRoleDto } from '../dto/add-role.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/create')
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
  async create(@Body() dto: CreateUserDto): Promise<SafeUser> {
    return await this.usersService.createUser(dto);
  }

  @Get('/getAll')
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
  async getAll(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Post('/role')
  @ApiOperation({
    summary: 'Добавить роль пользователю',
    description:
      'Назначение одной из предопределенных ролей (admin, moderator, customer, manager, premium)',
  })
  @ApiResponse({
    status: 200,
    description: 'Роль успешно добавлена',
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидные данные (некорректный ID или роль)',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @ApiBody({
    type: AddRoleDto,
    examples: {
      admin: {
        summary: 'Назначение админа',
        value: {
          user: '507f1f77bcf86cd799439011',
          role: 'admin',
        },
      },
      customer: {
        summary: 'Назначение покупателя',
        value: {
          user: '614451c3c3d4e4a9f8f7e6b5',
          role: 'customer',
        },
      },
    },
  })
  async addRole(@Body() dto: AddRoleDto): Promise<void> {
    await this.usersService.addRole(dto);
  }
}
