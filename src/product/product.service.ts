import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Product,
  CreateProductData,
  UpdateProductData,
} from './product.entity';
import { BaseService } from '../common/services/base.service';

export interface BestSellingProductResult {
  productName: string;
  price: string;
  companyName: string;
  totalSold: string;
}

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

  async getBestSellingProducts(): Promise<BestSellingProductResult> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('product.name', 'productName')
      .addSelect('product.price', 'price')
      .addSelect('company.name', 'companyName')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .innerJoin('order_item', 'orderItem', 'orderItem.product_id = product.id')
      .innerJoin('order', 'order', 'orderItem.order_id = order.id')
      .innerJoin('company', 'company', 'product.company_id = company.id')
      .where('order.type = :type', { type: 'shipment' })
      .andWhere('product.deleted_at IS NULL')
      .andWhere('orderItem.deleted_at IS NULL')
      .andWhere('order.deleted_at IS NULL')
      .andWhere('company.deleted_at IS NULL')
      .groupBy('product.name')
      .addGroupBy('product.price')
      .addGroupBy('company.name')
      .orderBy('"totalSold"', 'DESC')
      .take(1)
      .getRawOne<BestSellingProductResult>();

    if (!result) {
      throw new Error('No best selling product found');
    }

    return result;
  }
}
