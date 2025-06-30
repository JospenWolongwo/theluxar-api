import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSpecItemDto {
  @ApiProperty({
    description: 'Product ID that this spec item belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID('4')
  productId: string;

  @ApiProperty({
    description: 'Label of the spec item',
    example: 'Material',
  })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Value of the spec item',
    example: 'Stainless Steel',
  })
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class UpdateSpecItemDto {
  @ApiProperty({
    description: 'Label of the spec item',
    example: 'Material',
    required: false,
  })
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Value of the spec item',
    example: 'Stainless Steel',
    required: false,
  })
  @IsString()
  value?: string;
}
