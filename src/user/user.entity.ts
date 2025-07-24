import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Role } from '../common/enums/role.enum';
import { Company } from '../company/company.entity';

export type CreateUserData = Pick<
  User,
  'companyId' | 'username' | 'email' | 'password' | 'role'
>;
export type UpdateUserData = Partial<
  Pick<User, 'username' | 'email' | 'password' | 'role'>
>;
export type LoginData = Pick<User, 'email' | 'password'>;

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.VIEWER,
  })
  role!: Role;

  @Column({ name: 'modified_by', type: 'uuid', nullable: true })
  modifiedBy?: string;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifiedByUser?: User;
}
