import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../user/user.entity';
import { BusinessPartners } from '../business-partner/business-partner.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';
import { Invoice } from '../invoice/invoice.entity';

export type CreateCompanyData = Pick<Company, 'name' | 'modifiedBy'>;
export type UpdateCompanyData = Pick<Company, 'name'>;

@Entity({ name: 'company' })
export class Company extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy?: string;

  @OneToMany(() => User, (user) => user.company)
  users!: User[];

  @OneToMany(
    () => BusinessPartners,
    (businessPartner) => businessPartner.company,
  )
  businessPartners!: BusinessPartners[];

  @OneToMany(() => Warehouse, (warehouse) => warehouse.company)
  warehouses!: Warehouse[];

  @OneToMany(() => Product, (product) => product.company)
  products!: Product[];

  @OneToMany(() => Order, (order) => order.company)
  orders!: Order[];

  @OneToMany(() => Invoice, (invoice) => invoice.company)
  invoices!: Invoice[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;
}
