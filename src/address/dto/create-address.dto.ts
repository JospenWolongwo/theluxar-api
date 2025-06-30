import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { AddressType } from '../enums/address-type.enum';

export class CreateAddressDto {
  @ApiProperty({
    description: 'User ID who owns this address',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main Street',
  })
  @IsNotEmpty({ message: 'Address line 1 is required' })
  @IsString()
  line1: string;

  @ApiProperty({
    description: 'Address line 2 (optional)',
    example: 'Apartment 4B',
    required: false,
  })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State/Province (optional)',
    example: 'NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10001',
  })
  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'Country',
    example: 'United States',
  })
  @IsNotEmpty({ message: 'Country is required' })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1 (555) 123-4567',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Whether this is the default address for the user',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    description: 'Address type',
    enum: AddressType,
    example: AddressType.SHIPPING,
  })
  @IsNotEmpty({ message: 'Address type is required' })
  @IsEnum(AddressType, { message: 'Address type must be either SHIPPING or BILLING' })
  type: AddressType;
}
