import { Document } from 'mongoose';
import { Brand } from '../../brands/models/brand.model';
import { ParentProduct } from '../../parent-product/models/parent-product.model';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  color: string;
  images?: string[];
  isActive: boolean;
  discount?: number;
  brandId: Brand;
  parentProductId: ParentProduct;
}
