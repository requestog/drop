import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<{ token: string }> {
    const user: User = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto): Promise<{ token: string }> {
    const candidate: User | null = await this.userService.getUserByEmail(
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

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    try {
      const user: User | null = await this.userService.getUserByEmail(
        userDto.email,
      );

      if (!user) {
        throw new NotFoundException('Invalid User or password');
      }

      const isValidPassword: Promise<boolean> = bcrypt.compare(
        userDto.password,
        user.passwordHash,
      );

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }
      return user;
    } catch (error) {
      console.log('Invalid user or password');
      throw new UnauthorizedException({
        message: 'Invalid user or password',
        error,
      });
    }
  }
}
