import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Company } from '../company/company.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';

export type CreateInvoiceData = Pick<
  Invoice,
  'companyId' | 'orderId' | 'invoiceNumber' | 'date' | 'modifiedBy'
>;
export type UpdateInvoiceData = Pick<
  Invoice,
  'orderId' | 'invoiceNumber' | 'date'
>;

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId!: string;

  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  invoiceNumber!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy!: string;

  @ManyToOne(() => Company, (company) => company.invoices)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @OneToOne(() => Order, (order) => order.invoice)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;
}
