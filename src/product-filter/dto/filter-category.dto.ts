import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  ValidateNested 
} from 'class-validator';
import { FilterType } from '../entities/filter-category.entity';
import { CreateFilterOptionDto, UpdateFilterOptionDto } from './filter-option.dto';

export class CreateFilterCategoryDto {
  @ApiProperty({
    description: 'Title of the filter category',
    example: 'Size',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Type of filter',
    enum: FilterType,
    example: FilterType.CHECKBOX,
  })
  @IsNotEmpty()
  @IsEnum(FilterType)
  type: FilterType;

  @ApiProperty({
    description: 'Icon representing the filter category (optional)',
    example: 'size-icon',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Filter options',
    type: [CreateFilterOptionDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateFilterOptionDto)
  options?: CreateFilterOptionDto[];
}

export class UpdateFilterCategoryDto {
  @ApiProperty({
    description: 'Title of the filter category',
    example: 'Size',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Type of filter',
    enum: FilterType,
    example: FilterType.CHECKBOX,
    required: false,
  })
  @IsOptional()
  @IsEnum(FilterType)
  type?: FilterType;

  @ApiProperty({
    description: 'Icon representing the filter category',
    example: 'size-icon',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Filter options',
    type: [UpdateFilterOptionDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateFilterOptionDto)
  options?: UpdateFilterOptionDto[];
}
