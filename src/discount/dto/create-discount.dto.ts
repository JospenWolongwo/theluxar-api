import { IsNotEmpty, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty({ description: 'Stock ID' })
  @IsUUID()
  @IsNotEmpty()
  stockId: string;

  @ApiProperty({ description: 'Discount percentage (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({ description: 'Minimum quantity to order for discount eligibility', minimum: 1 })
  @IsNumber()
  @Min(1)
  minQuantityToOrder: number;
}
