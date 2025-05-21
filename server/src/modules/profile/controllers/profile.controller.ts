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

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/get/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль пользователя' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить профиль пользователя' })
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
