import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from '../common/enums/role.enum';

type UserAttributes = {
  id: string;
  company_id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  modified_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

export type CreateUserData = Pick<
  UserAttributes,
  'company_id' | 'username' | 'email' | 'password' | 'role'
>;

export type UpdateUserData = Partial<
  Pick<UserAttributes, 'username' | 'email' | 'password' | 'role'>
>;

export type LoginData = {
  email: string;
  password: string;
};

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.VIEWER,
  })
  role: Role;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
