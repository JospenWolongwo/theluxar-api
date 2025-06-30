import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FilterOption } from './filter-option.entity';

export enum FilterType {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXT = 'text',
  ICON = 'icon',
}

@Entity('filter_categories')
export class FilterCategory {
  @ApiProperty({ description: 'The unique identifier of the filter category' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the filter category' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Type of filter', enum: FilterType })
  @Column({
    type: 'enum',
    enum: FilterType,
    default: FilterType.CHECKBOX,
  })
  type: FilterType;

  @ApiProperty({ description: 'Icon representing the filter category (optional)', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ description: 'Options for this filter category', type: () => [FilterOption] })
  @OneToMany(() => FilterOption, option => option.filterCategory, {
    cascade: true,
    eager: true,
  })
  options: FilterOption[];

  @ApiProperty({ description: 'When the filter category was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the filter category was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
