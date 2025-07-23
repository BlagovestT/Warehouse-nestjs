import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Product,
  CreateProductData,
  UpdateProductData,
} from './product.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }

  protected getEntityName(): string {
    return 'Product';
  }

  // CRUD
  async getAllProducts(): Promise<Product[]> {
    return this.getAll();
  }

  async getProductById(id: string): Promise<Product> {
    return this.getById(id);
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const { name } = productData;

    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });

    if (existingProduct) {
      throw new ConflictException('Product already exists');
    }

    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async updateProduct(
    id: string,
    updateData: UpdateProductData,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateData.name },
      });

      if (existingProduct) {
        throw new ConflictException('Name already exists');
      }
    }

    await this.productRepository.update(id, updateData);
    return await this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }
}
