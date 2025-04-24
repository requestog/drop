import { Document, Types } from 'mongoose';
import { Brand } from '../../brands/models/brand.model';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  // sizes: string[];
  // colors: string[];
  categories: string[];
  images?: string[];
  isActive: boolean;
  // averageRating?: number;
  // reviewCount?: number;
  discount?: number;
  brandId: Brand;
}
