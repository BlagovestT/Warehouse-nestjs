import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

export enum SupportType {
  SOLID = 'solid',
  LIQUID = 'liquid',
  MIXED = 'mixed',
}

export type CreateWarehouseData = Pick<
  Warehouse,
  'companyId' | 'supportType' | 'name' | 'modifiedBy'
>;
export type UpdateWarehouseData = Pick<Warehouse, 'supportType' | 'name'>;

@Entity({ name: 'warehouse' })
export class Warehouse extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({
    name: 'support_type',
    type: 'enum',
    enum: SupportType,
  })
  supportType!: SupportType;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy!: string;

  @ManyToOne(() => Company, (company) => company.warehouses)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;

  @OneToMany(() => Order, (order) => order.warehouse)
  orders!: Order[];
}
