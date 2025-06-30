import { 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsUUID, 
  Max, 
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: 'Stock ID' })
  @IsUUID()
  @IsOptional()
  stockId?: string;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Username of reviewer' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({ description: 'Name of reviewer for display' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Review comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({ description: 'Review text for UI display' })
  @IsString()
  @IsOptional()
  reviewText?: string;

  @ApiProperty({ description: 'Rating from 0-5', minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Review date' })
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional({ description: 'Verified purchase status' })
  @IsOptional()
  verified?: boolean;

  @ApiPropertyOptional({ description: 'Helpful votes count' })
  @IsNumber()
  @IsOptional()
  helpful?: number;

  @ApiPropertyOptional({ description: 'Not helpful votes count' })
  @IsNumber()
  @IsOptional()
  notHelpful?: number;

  @ApiPropertyOptional({ description: 'Additional review content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Image URL for the review' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Position/title of the reviewer' })
  @IsString()
  @IsOptional()
  position?: string;
}
