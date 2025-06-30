import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entities/product.entity';
import { StockAvailabilityStatus } from '../types/stock-availability-status.enum';
import { TimeLapse } from '../types/time-lapse.interface';
import { Discount } from '../../discount/entities/discount.entity';
import { Review } from '../../review/entities/review.entity';

@Entity({ name: 'stocks' })
export class Stock extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, product => product.stocks)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  characteristics: Record<string, string>;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount: number;

  @OneToMany(() => Discount, discount => discount.stock)
  discounts: Discount[];

  @Column({
    name: 'availability_status',
    type: 'enum',
    enum: StockAvailabilityStatus,
    default: StockAvailabilityStatus.IN_STOCK,
  })
  availabilityStatus: StockAvailabilityStatus;

  @Column({ name: 'keeping_unit', nullable: true })
  keepingUnit: string;

  @Column({ name: 'guarantee', type: 'jsonb', nullable: true })
  guarantee: TimeLapse;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  pictures: string[];

  @Column({ name: 'description', type: 'jsonb', nullable: true })
  description: {
    shortDescription: string | null;
    longDescription: string[] | null;
  } | null;

  @Column({ name: 'manual_pdf', nullable: true })
  manualPdf: string | null;

  @Column({ name: 'delivery_duration', type: 'jsonb', nullable: true })
  deliveryDuration: TimeLapse | null;

  @OneToMany(() => Review, review => review.stock)
  reviews: Review[];
}
