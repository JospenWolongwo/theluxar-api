import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { AddressType } from '../enums/address-type.enum';

@Entity('addresses')
export class Address {
  @ApiProperty({ description: 'The unique identifier of the address' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to User' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'User relationship', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'First name for the address' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name for the address' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Address line 1' })
  @Column()
  line1: string;

  @ApiProperty({ description: 'Address line 2 (optional)', required: false })
  @Column({ nullable: true })
  line2?: string;

  @ApiProperty({ description: 'City' })
  @Column()
  city: string;

  @ApiProperty({ description: 'State/Province (optional)', required: false })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ description: 'Postal code' })
  @Column()
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @Column()
  country: string;

  @ApiProperty({ description: 'Phone number' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Whether this is the default address for the user', default: false })
  @Column({ default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Address type', enum: AddressType })
  @Column({
    type: 'enum',
    enum: AddressType,
  })
  type: AddressType;

  @ApiProperty({ description: 'When the address was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the address was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
