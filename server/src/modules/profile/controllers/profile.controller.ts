import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/get/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получение профиля пользователя',
    description:
      'Получение данных профиля по ID пользователя.' +
      ' Доступно только авторизованным пользователям с ролью CUSTOMER.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @ApiOkResponse({
    description: 'Профиль успешно получен',
    type: ProfileResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Профиль не найден' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiBadRequestResponse({ description: 'Невалидный ID пользователя' })
  async get(@Param('id') id: string): Promise<ProfileResponseDto> {
    return await this.profileService.get(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновление профиля пользователя',
    description:
      'Изменение данных профиля по ID пользователя.' +
      ' Доступно только авторизованным пользователям с ролью CUSTOMER.' +
      ' Принимает новые данные профиля.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @ApiBody({
    description: 'Данные для обновления профиля',
    type: ProfileDto,
  })
  @ApiOkResponse({ description: 'Профиль успешно обновлен' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiNotFoundResponse({ description: 'Профиль не найден' })
  @ApiBadRequestResponse({ description: 'Невалидные данные' })
  async update(
    @Body() dto: ProfileDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.profileService.update(dto, id);
  }
}
