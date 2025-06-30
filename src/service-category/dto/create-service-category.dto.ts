import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateServiceCategoryDto {
  @ApiProperty({
    description: 'Title of the service category',
    example: 'Home Renovation',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the service category',
    example: 'Professional home renovation services for all your needs',
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Icon representation for the service category',
    example: 'home-repair',
  })
  @IsNotEmpty({ message: 'Icon is required' })
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'Array of features for this service category',
    example: ['Kitchen remodeling', 'Bathroom renovation', 'Flooring installation'],
    type: [String],
  })
  @IsNotEmpty({ message: 'At least one feature is required' })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one feature is required' })
  @IsString({ each: true })
  features: string[];
}
