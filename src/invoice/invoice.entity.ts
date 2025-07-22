import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export interface InvoiceAttributes {
  id: string;
  companyId: string;
  orderId: string;
  invoiceNumber: string;
  date: Date;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type CreateInvoiceData = Pick<
  InvoiceAttributes,
  'companyId' | 'orderId' | 'invoiceNumber' | 'date' | 'modifiedBy'
>;

export type UpdateInvoiceData = Pick<
  InvoiceAttributes,
  'orderId' | 'invoiceNumber' | 'date'
>;

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  invoiceNumber: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
