import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../../src/product/product.controller';
import { ProductRepository } from '../../src/product/product.repository';
import { ProductService } from '../../src/product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
