import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUserPermissionDto {
  @ApiPropertyOptional({
    example: ['UpdateUser', 'CreateCategory'],
  })
  @IsArray()
  @ArrayUnique()
  @IsNotEmpty()
  @IsString({ each: true })
  permissions: string[];

  @IsString()
  appName: string[];
}
