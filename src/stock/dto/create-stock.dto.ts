import { 
  IsBoolean, 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsObject, 
  IsOptional, 
  IsString, 
  IsUUID, 
  ValidateNested 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StockAvailabilityStatus } from '../types/stock-availability-status.enum';
import { TimeLapse } from '../types/time-lapse.interface';

class TimeLapseDto implements TimeLapse {
  @ApiProperty({ description: 'Time amount' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Time unit', enum: ['day', 'week', 'month', 'year'] })
  @IsString()
  @IsNotEmpty()
  timeUnit: 'day' | 'week' | 'month' | 'year';
}

class DescriptionDto {
  @ApiPropertyOptional({ description: 'Short description' })
  @IsString()
  @IsOptional()
  shortDescription: string | null;

  @ApiPropertyOptional({ description: 'Long description as array of paragraphs' })
  @IsOptional()
  @IsString({ each: true })
  longDescription: string[] | null;
}

export class CreateStockDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Stock quantity' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Stock price' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Stock characteristics as key-value pairs' })
  @IsOptional()
  @IsObject()
  characteristics?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Availability status', default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Discount percentage' })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({ description: 'Stock availability status', enum: StockAvailabilityStatus })
  @IsEnum(StockAvailabilityStatus)
  @IsOptional()
  availabilityStatus?: StockAvailabilityStatus;

  @ApiPropertyOptional({ description: 'Stock keeping unit' })
  @IsString()
  @IsOptional()
  keepingUnit?: string;

  @ApiPropertyOptional({ description: 'Guarantee information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimeLapseDto)
  guarantee?: TimeLapseDto;

  @ApiPropertyOptional({ description: 'Additional pictures' })
  @IsOptional()
  @IsString({ each: true })
  pictures?: string[];

  @ApiPropertyOptional({ description: 'Stock description' })
  @IsOptional()
  @ValidateNested()
  @Type(() => DescriptionDto)
  description?: DescriptionDto;

  @ApiPropertyOptional({ description: 'Manual PDF URL' })
  @IsString()
  @IsOptional()
  manualPdf?: string | null;

  @ApiPropertyOptional({ description: 'Delivery duration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimeLapseDto)
  deliveryDuration?: TimeLapseDto | null;
}
