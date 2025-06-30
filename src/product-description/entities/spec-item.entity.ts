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

@Entity('spec_items')
export class SpecItem {
  @ApiProperty({ description: 'The unique identifier of the spec item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to Product' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product relationship', type: () => Product })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Label of the spec item' })
  @Column()
  label: string;

  @ApiProperty({ description: 'Value of the spec item' })
  @Column()
  value: string;

  @ApiProperty({ description: 'When the spec item was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the spec item was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
