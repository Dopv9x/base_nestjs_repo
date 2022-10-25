import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../src/enum/role.enum';
import { IsEnum } from 'class-validator';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(['email'])
  @Column()
  email: string;

  @Column({ name: 'firstname' })
  firstName: string;

  @Column({ name: 'lastname' })
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: true, name: 'isactive' })
  isActive: boolean;

  @Column({ name: 'roles' })
  @IsEnum(Role)
  roles: Role;

  @CreateDateColumn({
    default: `now()`,
    nullable: true,
    name: 'createdat',
  })
  createdAt: string;

  @UpdateDateColumn({
    default: `now()`,
    nullable: true,
    name: 'updatedat',
  })
  updatedAt: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
