import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIncludedItemDto {
  @ApiProperty({
    description: 'Product ID that this included item belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID('4')
  productId: string;

  @ApiProperty({
    description: 'Icon representing the included item',
    example: 'headphones',
  })
  @IsNotEmpty()
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'Label of the included item',
    example: 'Wireless Headphones',
  })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Additional note about the included item (optional)',
    example: 'Includes charging case',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateIncludedItemDto {
  @ApiProperty({
    description: 'Icon representing the included item',
    example: 'headphones',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Label of the included item',
    example: 'Wireless Headphones',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({
    description: 'Additional note about the included item',
    example: 'Includes charging case',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
