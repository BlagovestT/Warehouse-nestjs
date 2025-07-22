import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum SupportType {
  SOLID = 'solid',
  LIQUID = 'liquid',
  MIXED = 'mixed',
}

export interface WarehouseAttributes {
  id: string;
  companyId: string;
  supportType: SupportType;
  name: string;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type CreateWarehouseData = Pick<
  WarehouseAttributes,
  'companyId' | 'supportType' | 'name' | 'modifiedBy'
>;

export type UpdateWarehouseData = Pick<
  WarehouseAttributes,
  'supportType' | 'name'
>;

@Entity('warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({
    name: 'support_type',
    type: 'enum',
    enum: SupportType,
  })
  supportType: SupportType;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
