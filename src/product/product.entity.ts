import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { OrderItem } from '../order-item/order-item.entity';

export enum ProductType {
  SOLID = 'solid',
  LIQUID = 'liquid',
}

export type CreateProductData = Pick<
  Product,
  'companyId' | 'name' | 'price' | 'type' | 'modifiedBy'
>;
export type UpdateProductData = Pick<Product, 'name' | 'price' | 'type'>;

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type!: ProductType;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy!: string;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];
}
