import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';
import { SafeUser } from '../types/user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private readonly logger: Logger = new Logger('UserService');

  async createUser(
    userDto: CreateUserDto,
    confirmationTokenParam?: string,
    confirmationExpiresParam?: Date,
  ): Promise<SafeUser> {
    try {
      const hashedPassword: string = await this.hashPassword(userDto.password);
      const nickName: string = await this.generateUniqueNickName();
      const newUser: User = new this.userModel({
        ...userDto,
        passwordHash: hashedPassword,
        roles: [Role.User],
        emailVerified: false,
        confirmationToken: confirmationTokenParam,
        confirmationExpires: confirmationExpiresParam,
        nickName: nickName,
      });

      const savedUser: User = await newUser.save();

      return this.toSafeUser(savedUser);
    } catch (error) {
      this.logger.error(
        `Failed to create review: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create user');
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
    try {
      const data = await this.userModel
        .find()
        .select('-passwordHash -confirmationToken -confirmationExpires')
        .exec();
      return data;
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  async getUser(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();
      return user;
    } catch (error) {
      this.logger.error(`Failed to get user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  async confirmEmail(confirmationToken: string): Promise<void> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { confirmationToken },
          { $set: { emailVerified: true } },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new Error('Incorrect activation link');
      }
    } catch (error) {
      this.logger.error(
        `Failed to confirm email: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to confirm email');
    }
  }

  public toSafeUser(user: User): SafeUser {
    const userObject = Object(user);

    const {
      passwordHash,
      confirmationToken,
      confirmationExpires,
      ...safeData
    } = userObject;

    return {
      ...safeData,
      _id: user._id,
    } as SafeUser;
  }
}
