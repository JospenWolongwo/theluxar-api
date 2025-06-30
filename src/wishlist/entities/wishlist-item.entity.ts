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
import { Wishlist } from './wishlist.entity';

@Entity('wishlist_items')
export class WishlistItem {
  @ApiProperty({ description: 'The unique identifier of the wishlist item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to Wishlist' })
  @Column()
  wishlistId: string;

  @ApiProperty({ description: 'Wishlist relationship', type: () => Wishlist })
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlistId' })
  wishlist: Wishlist;

  @ApiProperty({ description: 'Foreign key to Product' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product relationship', type: () => Product })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'When the item was added to the wishlist' })
  @CreateDateColumn({ name: 'addedAt' })
  addedAt: Date;

  @ApiProperty({ description: 'When the wishlist item was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the wishlist item was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
