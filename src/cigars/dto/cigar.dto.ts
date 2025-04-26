import {
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CigarGetDTO {
  @ApiProperty({
    description: 'Unique identifier of the cigar',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Name of the cigar',
    example: 'Partagas Serie D No. 4',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the brand', format: 'uuid' })
  @IsUUID()
  brand_id: string;

  @ApiProperty({ description: 'Name of the brand', example: 'Partagas' })
  @IsString()
  brand_name: string;

  @ApiProperty({
    description: 'List of vitolas for the cigar',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        length: { type: 'number' },
        ring_gauge: { type: 'number' },
      },
    },
  })
  vitolas: { id: string; name: string; length: number; ring_gauge: number }[];

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

export class CigarPostPayload {
  @ApiProperty({
    description: 'Unique identifier of the cigar',
    format: 'uuid',
  })
  @IsUUID()
  id?: string; // Made optional since it's not provided in the input but included in the response

  @ApiProperty({
    description: 'Name of the cigar',
    example: 'Partagas Serie D No. 4',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'ID of the brand', format: 'uuid' })
  @IsUUID()
  brand_id: string;
}

export class CigarPatchPayload {
  @ApiPropertyOptional({
    description: 'Name of the cigar',
    example: 'Partagas Serie D No. 4',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'ID of the brand', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  brand_id?: string;
}
