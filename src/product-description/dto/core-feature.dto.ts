import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCoreFeatureDto {
  @ApiProperty({
    description: 'Product ID that this core feature belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID('4')
  productId: string;

  @ApiProperty({
    description: 'Icon representing the core feature',
    example: 'eco-friendly',
  })
  @IsNotEmpty()
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'Label of the core feature',
    example: 'Eco-Friendly',
  })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Value of the core feature',
    example: 'Made from recycled materials',
  })
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class UpdateCoreFeatureDto {
  @ApiProperty({
    description: 'Icon representing the core feature',
    example: 'eco-friendly',
    required: false,
  })
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Label of the core feature',
    example: 'Eco-Friendly',
    required: false,
  })
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Value of the core feature',
    example: 'Made from recycled materials',
    required: false,
  })
  @IsString()
  value?: string;
}
