import { Product } from '../models/product.model';

export default interface PaginatedProducts {
  items: Product[];
  total: number;
  page?: number;
  limit?: number;
}
