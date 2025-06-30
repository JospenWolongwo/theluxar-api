import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart-item.dto';

export class CreateCartDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Cart items', type: [CreateCartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  @IsOptional()
  items?: CreateCartItemDto[];

  @ApiPropertyOptional({ description: 'Cart subtotal', default: 0 })
  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @ApiPropertyOptional({ description: 'Cart discount', default: 0 })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({ description: 'Cart tax', default: 0 })
  @IsNumber()
  @IsOptional()
  tax?: number;

  @ApiPropertyOptional({ description: 'Cart total', default: 0 })
  @IsNumber()
  @IsOptional()
  total?: number;
}
