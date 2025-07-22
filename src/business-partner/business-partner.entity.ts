import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum BusinessPartnerType {
  CUSTOMER = 'customer',
  SUPPLIER = 'supplier',
}

export interface BusinessPartnersAttributes {
  id: string;
  companyId: string;
  name: string;
  email: string;
  type: BusinessPartnerType;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type CreateBusinessPartnersData = Pick<
  BusinessPartnersAttributes,
  'companyId' | 'name' | 'email' | 'type' | 'modifiedBy'
>;

export type UpdateBusinessPartnersData = Pick<
  BusinessPartnersAttributes,
  'name' | 'email' | 'type'
>;

@Entity('business_partners')
export class BusinessPartners {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: BusinessPartnerType,
  })
  type: BusinessPartnerType;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
