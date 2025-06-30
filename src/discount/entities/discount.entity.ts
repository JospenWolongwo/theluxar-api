import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Stock } from '../../stock/entities/stock.entity';

@Entity({ name: 'discounts' })
export class Discount extends BaseEntity {
  @Column({ name: 'stock_id' })
  stockId: string;

  @ManyToOne(() => Stock, stock => stock.discounts)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ name: 'min_quantity_to_order' })
  minQuantityToOrder: number;
}
