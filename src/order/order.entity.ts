import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Company } from '../company/company.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { BusinessPartners } from '../business-partner/business-partner.entity';
import { User } from '../user/user.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { Invoice } from '../invoice/invoice.entity';

export enum OrderType {
  SHIPMENT = 'shipment',
  DELIVERY = 'delivery',
}

export type CreateOrderData = Pick<
  Order,
  | 'companyId'
  | 'warehouseId'
  | 'businessPartnerId'
  | 'orderNumber'
  | 'type'
  | 'modifiedBy'
>;
export type UpdateOrderData = Pick<
  Order,
  'warehouseId' | 'businessPartnerId' | 'orderNumber' | 'type'
>;

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId!: string;

  @Column({ name: 'business_partner_id', type: 'uuid' })
  businessPartnerId!: string;

  @Column({ name: 'order_number', type: 'varchar', length: 255, unique: true })
  orderNumber!: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type!: OrderType;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy!: string;

  @ManyToOne(() => Company, (company) => company.orders)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.orders)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @ManyToOne(
    () => BusinessPartners,
    (businessPartner) => businessPartner.orders,
  )
  @JoinColumn({ name: 'business_partner_id' })
  businessPartner!: BusinessPartners;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];

  @OneToOne(() => Invoice, (invoice) => invoice.order)
  invoice!: Invoice;
}
