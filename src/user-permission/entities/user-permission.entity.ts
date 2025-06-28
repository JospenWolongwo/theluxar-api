import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { User } from '../../user/entities/user.entity';
import type { Permission } from '../utils';

@Entity({ name: 'user_permission' })
export class UserPermissionEntity extends BaseEntity {
  @OneToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @Column('simple-array', {
    default: '',
  })
  permissions: Permission[];
}
