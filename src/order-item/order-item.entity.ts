import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

export type CreateOrderItemData = Pick<
  OrderItem,
  'orderId' | 'productId' | 'quantity' | 'modifiedBy'
>;
export type UpdateOrderItemData = Pick<OrderItem, 'productId' | 'quantity'>;

@Entity({ name: 'order_item' })
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy!: string;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;
}
