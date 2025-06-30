import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { WishlistItem } from './wishlist-item.entity';

@Entity('wishlists')
export class Wishlist {
  @ApiProperty({ description: 'The unique identifier of the wishlist' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to User' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'User relationship', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Items in the wishlist', type: [WishlistItem] })
  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.wishlist, {
    cascade: true,
    eager: true,
  })
  items: WishlistItem[];

  @ApiProperty({ description: 'When the wishlist was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the wishlist was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
