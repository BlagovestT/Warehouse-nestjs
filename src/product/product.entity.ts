import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ProductType {
  SOLID = 'solid',
  LIQUID = 'liquid',
}

export interface ProductAttributes {
  id: string;
  companyId: string;
  name: string;
  price: number;
  type: ProductType;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type CreateProductData = Pick<
  ProductAttributes,
  'companyId' | 'name' | 'price' | 'type' | 'modifiedBy'
>;

export type UpdateProductData = Pick<
  ProductAttributes,
  'name' | 'price' | 'type'
>;

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type: ProductType;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
