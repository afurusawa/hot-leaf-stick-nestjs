import {
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandGetDTO {
  @ApiProperty({
    description: 'Unique identifier of the brand',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Name of the brand', example: 'Partagas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Website URL of the brand',
    example: 'https://www.partagas.com',
  })
  @IsOptional()
  @IsString()
  site_url: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @IsString()
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
  })
  @IsString()
  updated_at: Date;
}

export class BrandPostPayload {
  @ApiProperty({ description: 'Name of the brand', example: 'Partagas' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Website URL of the brand',
    example: 'https://www.partagas.com',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  site_url?: string | null;
}

export class BrandPatchPayload {
  @ApiPropertyOptional({
    description: 'Name of the brand',
    example: 'Partagas',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Website URL of the brand',
    example: 'https://www.partagas.com',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  site_url?: string | null;
}
