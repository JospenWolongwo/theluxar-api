import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Category } from '../../category/entities/category.entity';
import { ProductLabel } from '../types/product-label.type';
import { Stock } from '../../stock/entities/stock.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  sku: string;

  @Column()
  specs: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  ingredients: string;

  @Column({ name: 'usage_instructions', nullable: true, type: 'text' })
  usageInstructions: string;

  @Column({ type: 'jsonb', default: '[]' })
  images: Array<{
    id: string;
    url: string;
    thumbnail?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  variants: Array<{
    id: string;
    name: string;
    price?: number;
  }>;

  @Column({ name: 'short_description', nullable: true })
  shortDescription: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'min_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minPrice: number;

  @Column({
    name: 'max_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxPrice: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ name: 'label', type: 'enum', enum: ProductLabel, nullable: true })
  label: ProductLabel;

  @Column({ name: 'label_color', nullable: true })
  labelColor: string;

  @Column({ name: 'in_stock', default: true })
  inStock: boolean;

  @Column({ nullable: true })
  volume: string;

  @Column({ type: 'jsonb', nullable: true })
  rating:
    | number
    | {
        count: number;
        average: number;
      };

  @Column({ type: 'jsonb', default: '[]' })
  features: string[];

  @Column({ name: 'gallery_images', type: 'jsonb', default: '[]' })
  galleryImages: string[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'products_categories',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];
  
  @OneToMany(() => Stock, stock => stock.product)
  stocks: Stock[];
}
