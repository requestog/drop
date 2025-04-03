import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto): Promise<{ token: string }> {
    const candidate: User | undefined = await this.userService.getUserByEmail(
      userDto.email,
    );
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.userService.createUser(userDto);
    return await this.generateToken(user);
  }

  async generateToken(user: User): Promise<{ token: string }> {
    const payload = { email: user.email, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
