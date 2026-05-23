import { Category } from '@prisma/client';

export interface CategoryTree extends Category {
  children?: CategoryTree[];
  _count?: {
    products: number;
  };
}
