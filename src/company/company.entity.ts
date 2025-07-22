import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

type CompanyAttributes = {
  id: string;
  name: string;
  modifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type CreateCompanyData = Pick<CompanyAttributes, 'name' | 'modifiedBy'>;

export type UpdateCompanyData = Pick<CompanyAttributes, 'name'>;

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'modifiedBy', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
