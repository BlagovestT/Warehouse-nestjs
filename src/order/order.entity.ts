import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum OrderType {
  SHIPMENT = 'shipment',
  DELIVERY = 'delivery',
}

export interface OrderAttributes {
  id: string;
  companyId: string;
  warehouseId: string;
  businessPartnerId: string;
  orderNumber: string;
  type: OrderType;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type CreateOrderData = Pick<
  OrderAttributes,
  | 'companyId'
  | 'warehouseId'
  | 'businessPartnerId'
  | 'orderNumber'
  | 'type'
  | 'modifiedBy'
>;

export type UpdateOrderData = Pick<
  OrderAttributes,
  'warehouseId' | 'businessPartnerId' | 'orderNumber' | 'type'
>;

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'business_partner_id', type: 'uuid' })
  businessPartnerId: string;

  @Column({ name: 'order_number', type: 'varchar', length: 255, unique: true })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
