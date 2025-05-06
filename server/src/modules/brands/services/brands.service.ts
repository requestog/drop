import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from '../models/brand.model';
import { Model, Types } from 'mongoose';
import { FilesService } from '../../files/files.service';
import { ParentProduct } from '../../parent-product/models/parent-product.model';
import { ParentProductService } from '../../parent-product/services/parent-product.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
    @InjectModel(ParentProduct.name)
    private readonly parentProductModel: Model<ParentProduct>,
    private readonly fileService: FilesService,
    private readonly parentProductService: ParentProductService,
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create brand');
    }
  }

  async updateBrand(
    dto: BrandCreateDto,
    id: string,
    image: Express.Multer.File,
  ) {
    try {
      const brand = await this.brandModel.findById(id);
      if (!brand) {
        throw new NotFoundException(`Brand with id ${id} not found`);
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update brand');
    }
  }

  async deleteBrand(id: string): Promise<void> {
    try {
      const [brand] = await Promise.all([this.brandModel.findById(id)]);
      if (!brand) {
        throw new NotFoundException(`Brand with id ${id} not found`);
      }

      const products = await this.parentProductModel.find({
        brand: new Types.ObjectId(id),
      });

      await Promise.all(
        products.map((product) =>
          this.parentProductService.deleteParentProduct(String(product._id)),
        ),
      );

      await this.brandModel.deleteOne({ _id: id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete brand');
    }
  }
}
