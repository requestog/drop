import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword: string = await this.hashPassword(userDto.password);
      const nickName: string = await this.generateUniqueNickName();
      const newUser: User = new this.userModel({
        ...userDto,
        passwordHash: hashedPassword,
        roles: [Role.User],
        emailVerified: false,
        nickName: nickName,
      });
      const savedUser: User = await newUser.save();
      const { passwordHash, ...result } = savedUser.toObject();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  private async generateUniqueNickName(): Promise<string> {
    const uuid: string = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    return `user_${uuid}`;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-passwordHash');
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    console.log(user);
    return user;
  }
}
