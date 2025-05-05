import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from '../models/brand.model';
import { Model } from 'mongoose';
import { FilesService } from '../../files/files.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
    private readonly fileService: FilesService,
  ) {}

  async createBrand(
    dto: BrandCreateDto,
    image?: Express.Multer.File,
  ): Promise<void> {
    try {
      let imageUrl: string | undefined = undefined;
      if (image) {
        imageUrl = await this.fileService.saveFile(image, 'brands');
      }
      const model = await new this.brandModel({ ...dto, image: imageUrl });
      await model.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateBrand(
    dto: BrandCreateDto,
    id: string,
    image: Express.Multer.File,
  ) {
    try {
      const brand = await this.brandModel.findOne({ _id: id });
      if (!brand) {
        throw new InternalServerErrorException(`Brand with id ${id} not found`);
      }
      if (brand.image) {
        await this.fileService.deleteFile(brand.image);
      }
      let imageUrl: string | undefined = undefined;
      if (image) {
        imageUrl = await this.fileService.saveFile(image, 'brands');
      }
      await this.brandModel.updateOne(
        { _id: id },
        { name: dto.name, image: imageUrl },
      );
    } catch {
      throw new HttpException('Error updating brand', HttpStatus.BAD_REQUEST);
    }
  }
}
