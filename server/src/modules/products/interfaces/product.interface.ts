import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  categories: string[];
  images?: string[];
  isActive: boolean;
  discount?: number;
}
