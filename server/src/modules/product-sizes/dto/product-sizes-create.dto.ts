import { Product } from '../../products/models/product.model';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductSizesCreateDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: Product;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}
