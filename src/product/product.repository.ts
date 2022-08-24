import { EntityRepository, Repository } from 'typeorm';
import { Product } from '@src/product/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  getAllProducts(): Promise<Product[]> {
    return this.createQueryBuilder().getMany();
  }
}
