import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/models/user.model';
import { Model, Types } from 'mongoose';
import { FilesService } from '../../files/files.service';
import { ProfileDto } from '../dto/profile.dto';
import { IProfile } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly fileService: FilesService,
  ) {}

  private readonly logger: Logger = new Logger('ProfileService');

  async get(id: string): Promise<IProfile> {
    try {
      const profile = await this.userModel
        .findById(new Types.ObjectId(id))
        .select('email nickName roles emailVerified')
        .lean()
        .exec();

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      const result: IProfile = {
        email: profile.email,
        nickname: profile.nickName,
        roles: profile.roles,
        emailVerified: profile.emailVerified,
      };

      return result;
    } catch (error) {
      this.logger.error('Error getting profile details', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get profile');
    }
  }

  async update(dto: ProfileDto, id: string) {
    try {
      const profile = await this.userModel.findById(id).exec();
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      await this.userModel.updateOne(
        { _id: id },
        {
          name: dto.name,
          phone: dto.phone,
        },
      );
    } catch (error) {
      this.logger.error('Error update profile', error);
      throw new InternalServerErrorException('Error update profile');
    }
  }
}
