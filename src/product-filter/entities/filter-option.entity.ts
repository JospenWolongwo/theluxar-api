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
import { FilterCategory } from './filter-category.entity';

@Entity('filter_options')
export class FilterOption {
  @ApiProperty({ description: 'The unique identifier of the filter option' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Foreign key to FilterCategory' })
  @Column()
  filterCategoryId: string;

  @ApiProperty({ description: 'FilterCategory relationship', type: () => FilterCategory })
  @ManyToOne(() => FilterCategory, filterCategory => filterCategory.options)
  @JoinColumn({ name: 'filterCategoryId' })
  filterCategory: FilterCategory;

  @ApiProperty({ description: 'Name of the filter option' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Value of the filter option' })
  @Column()
  value: string;

  @ApiProperty({ description: 'Icon representing the filter option (optional)', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ description: 'Count of products with this option (optional)', required: false })
  @Column({ nullable: true })
  count?: number;

  @ApiProperty({ description: 'Whether this option is checked by default (optional)', required: false, default: false })
  @Column({ default: false })
  checked?: boolean;

  @ApiProperty({ description: 'When the filter option was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the filter option was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
