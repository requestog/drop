import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async registration(userDto: CreateUserDto) {
    const candidate: User | undefined = await this.userService.getUserByEmail(
      userDto.email,
    );
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.userService.createUser(userDto);
  }
}
