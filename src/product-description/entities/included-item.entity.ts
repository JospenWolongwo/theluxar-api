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

@Entity('included_items')
export class IncludedItem {
  @ApiProperty({ description: 'The unique identifier of the included item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to Product' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product relationship', type: () => Product })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Icon representing the included item' })
  @Column()
  icon: string;

  @ApiProperty({ description: 'Label of the included item' })
  @Column()
  label: string;

  @ApiProperty({ description: 'Additional note about the included item (optional)', required: false })
  @Column({ nullable: true })
  note?: string;

  @ApiProperty({ description: 'When the included item was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the included item was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
