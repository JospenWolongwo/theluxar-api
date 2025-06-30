import { Column, Entity, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => Category, category => category.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @Column({ nullable: true })
  image: string;

  @ManyToMany(() => Product, product => product.categories)
  products: Product[];
}
