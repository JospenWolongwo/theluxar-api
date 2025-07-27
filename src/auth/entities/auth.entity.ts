import { BeforeInsert, Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { encodeData } from '../../common/utils/helpers.util';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'authentication' })
export class Auth extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'last_login', nullable: true, type: 'timestamptz' })
  lastLogin: Date;

  @Column({ default: false })
  active: boolean;

  @OneToOne(() => User, (user) => user.auth, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
