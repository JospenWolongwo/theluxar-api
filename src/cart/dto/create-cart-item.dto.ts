import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiPropertyOptional({ description: 'Cart ID' })
  @IsUUID()
  @IsOptional()
  cartId?: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Price per unit' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Discount amount' })
  @IsNumber()
  @IsOptional()
  discount?: number;
}
