import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFilterOptionDto {
  @ApiProperty({
    description: 'FilterCategory ID that this option belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID('4')
  filterCategoryId?: string;

  @ApiProperty({
    description: 'Name of the filter option',
    example: 'Small',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Value of the filter option',
    example: 'S',
  })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Icon representing the filter option (optional)',
    example: 'size-s-icon',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Count of products with this option (optional)',
    example: 42,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiProperty({
    description: 'Whether this option is checked by default',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  checked?: boolean;
}

export class UpdateFilterOptionDto {
  @ApiProperty({
    description: 'ID of the filter option',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID('4')
  id?: string;
  
  @ApiProperty({
    description: 'FilterCategory ID that this option belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID('4')
  filterCategoryId?: string;
  @ApiProperty({
    description: 'Name of the filter option',
    example: 'Small',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Value of the filter option',
    example: 'S',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    description: 'Icon representing the filter option',
    example: 'size-s-icon',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Count of products with this option',
    example: 42,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiProperty({
    description: 'Whether this option is checked by default',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  checked?: boolean;
}
