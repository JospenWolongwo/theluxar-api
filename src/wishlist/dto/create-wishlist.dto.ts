import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWishlistItemDto } from './create-wishlist-item.dto';

export class CreateWishlistDto {
  @ApiProperty({
    description: 'The ID of the user who owns the wishlist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Initial items to add to the wishlist (optional)',
    type: [CreateWishlistItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWishlistItemDto)
  items?: CreateWishlistItemDto[];
}
