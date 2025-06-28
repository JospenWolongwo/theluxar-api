import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import type { UserPermissionEntity } from '../entities/user-permission.entity';

export class SerializedUserPermissions {
  @ApiProperty({
    example: ['Readusers', 'ReadUser'],
  })
  permissions: string[];

  @Exclude()
  id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  owner: User;

  constructor(partial: Partial<UserPermissionEntity>) {
    Object.assign(this, partial);
  }
}
