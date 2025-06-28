import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { UserPermissionEntity } from '../../user-permission/entities/user-permission.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Auth, (auth) => auth.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth: Auth;

  @OneToOne(() => UserPermissionEntity, (permissions) => permissions.owner)
  permissions: UserPermissionEntity;
}
