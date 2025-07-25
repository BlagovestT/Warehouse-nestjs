import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { BusinessPartnerType } from '../common/enums/business-partner.enum';

export type CreateBusinessPartnersData = Pick<
  BusinessPartners,
  'companyId' | 'name' | 'email' | 'type' | 'modifiedBy'
>;
export type UpdateBusinessPartnersData = Pick<
  BusinessPartners,
  'name' | 'email' | 'type'
>;

@Entity({ name: 'business_partners' })
export class BusinessPartners extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({
    type: 'enum',
    enum: BusinessPartnerType,
  })
  type!: BusinessPartnerType;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy!: string;

  @ManyToOne(() => Company, (company) => company.businessPartners)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;

  @OneToMany(() => Order, (order) => order.businessPartner)
  orders!: Order[];
}
