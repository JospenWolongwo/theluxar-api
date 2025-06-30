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
import { Product } from '../../product/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'The unique identifier of the order item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to Order' })
  @Column()
  orderId: string;

  @ApiProperty({ description: 'Order relationship', type: () => Order })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ description: 'Foreign key to Product' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product relationship', type: () => Product })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Snapshot of product data at time of order' })
  @Column('json')
  productData: Record<string, any>;

  @ApiProperty({ description: 'Quantity of items ordered' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Price per item at time of order' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Discount applied to this item', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @ApiProperty({ description: 'Total price for this item after discount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ description: 'When the order item was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the order item was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
