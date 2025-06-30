import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';
import { Stock } from '../../stock/entities/stock.entity';

@Entity({ name: 'reviews' })
export class Review extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'stock_id', nullable: true })
  stockId: string;

  @ManyToOne(() => Stock, stock => stock.reviews)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'review_text', type: 'text', nullable: true })
  reviewText: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: 0 })
  helpful: number;

  @Column({ name: 'not_helpful', default: 0 })
  notHelpful: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  position: string;
}
