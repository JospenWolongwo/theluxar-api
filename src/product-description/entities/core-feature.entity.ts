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

@Entity('core_features')
export class CoreFeature {
  @ApiProperty({ description: 'The unique identifier of the core feature' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to Product' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product relationship', type: () => Product })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Icon representing the core feature' })
  @Column()
  icon: string;

  @ApiProperty({ description: 'Label of the core feature' })
  @Column()
  label: string;

  @ApiProperty({ description: 'Value of the core feature' })
  @Column()
  value: string;

  @ApiProperty({ description: 'When the core feature was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the core feature was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
