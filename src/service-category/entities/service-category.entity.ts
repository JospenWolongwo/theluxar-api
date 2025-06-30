import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('service_categories')
export class ServiceCategory {
  @ApiProperty({ description: 'The unique identifier of the service category' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the service category' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Description of the service category' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Icon representation for the service category' })
  @Column()
  icon: string;

  @ApiProperty({ description: 'Array of features for this service category' })
  @Column('simple-array')
  features: string[];

  @ApiProperty({ description: 'When the service category was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the service category was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
