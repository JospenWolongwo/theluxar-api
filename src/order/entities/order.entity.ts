import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'The unique identifier of the order' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to User' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'User relationship', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Order number for easy reference' })
  @Column({ unique: true })
  orderNumber: string;

  @ApiProperty({ description: 'Items in the order', type: [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @ApiProperty({ description: 'Subtotal amount before tax and discount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ description: 'Discount amount applied to the order' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @ApiProperty({ description: 'Tax amount applied to the order' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @ApiProperty({ description: 'Total amount after tax and discount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ description: 'Current status of the order', enum: OrderStatus })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({ description: 'Shipping address details' })
  @Column({ type: 'json' })
  shippingAddress: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  @ApiProperty({ description: 'Billing address details' })
  @Column({ type: 'json' })
  billingAddress: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  @ApiProperty({ description: 'Payment method used' })
  @Column()
  paymentMethod: string;

  @ApiProperty({ description: 'Delivery method chosen' })
  @Column()
  deliveryMethod: string;

  @ApiProperty({ description: 'Tracking number for the shipment', required: false })
  @Column({ nullable: true })
  trackingNumber?: string;

  @ApiProperty({ description: 'Additional notes for the order', required: false })
  @Column({ nullable: true })
  notes?: string;

  @ApiProperty({ description: 'When the order was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the order was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
