import { Injectable } from '@nestjs/common';
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
    return this.userModel
      .find()
      .select('-passwordHash -confirmationToken -confirmationExpires')
      .exec();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return user;
  }

  async confirmEmailByToken(confirmationToken: string): Promise<void> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { confirmationToken },
        { $set: { emailVerified: true } },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      console.log('Incorrect activation link');
      throw new Error('Incorrect activation link');
    }
  }

  public toSafeUser(user: User): SafeUser {
    const userObject = user.toObject();

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
