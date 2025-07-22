import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type CreateOrderItemData = Pick<
  OrderItemAttributes,
  'orderId' | 'productId' | 'quantity' | 'modifiedBy'
>;

export type UpdateOrderItemData = Pick<
  OrderItemAttributes,
  'productId' | 'quantity'
>;

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
