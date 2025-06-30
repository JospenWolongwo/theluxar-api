import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @ApiProperty({ description: 'First name of the recipient', example: 'John' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the recipient', example: 'Doe' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Address line 1', example: '123 Main St' })
  @IsNotEmpty({ message: 'Address line 1 is required' })
  @IsString()
  line1: string;

  @ApiProperty({ description: 'Address line 2 (optional)', example: 'Apt 4B', required: false })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State/Province (optional)', example: 'NY', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Postal code', example: '10001' })
  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @IsNotEmpty({ message: 'Country is required' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Phone number', example: '+1 (555) 123-4567' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;
}
