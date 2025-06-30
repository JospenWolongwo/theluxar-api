import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductLabel } from '../types/product-label.type';

class ProductImageDto {
  @ApiProperty({ description: 'Image ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Image URL' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Thumbnail URL' })
  @IsString()
  @IsOptional()
  thumbnail?: string;
}

class ProductVariantDto {
  @ApiProperty({ description: 'Variant ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Variant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Variant price' })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Product brand' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: 'Product SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Product specifications' })
  @IsString()
  @IsNotEmpty()
  specs: string;

  @ApiProperty({ description: 'Main product image URL' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Product ingredients' })
  @IsString()
  @IsOptional()
  ingredients?: string;

  @ApiPropertyOptional({ description: 'Product usage instructions' })
  @IsString()
  @IsOptional()
  usageInstructions?: string;

  @ApiProperty({ description: 'Product images', type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @ApiPropertyOptional({ description: 'Product variants', type: [ProductVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiPropertyOptional({ description: 'Product short description' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Product active status', default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Product minimum price (for variable products)' })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Product maximum price (for variable products)' })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({ description: 'Product currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional({ description: 'Product slug for SEO' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Product label', enum: ProductLabel })
  @IsEnum(ProductLabel)
  @IsOptional()
  label?: ProductLabel;

  @ApiPropertyOptional({ description: 'Product label color' })
  @IsString()
  @IsOptional()
  labelColor?: string;

  @ApiPropertyOptional({ description: 'Product stock status', default: true })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @ApiPropertyOptional({ description: 'Product volume' })
  @IsString()
  @IsOptional()
  volume?: string;

  @ApiPropertyOptional({ description: 'Product features' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ description: 'Product gallery images' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  galleryImages?: string[];

  @ApiPropertyOptional({ description: 'Product categories IDs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}
