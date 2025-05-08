import { IsString, IsUUID, IsNumber, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVitolaDto {
  @ApiProperty({
    description: 'ID of the cigar this vitola belongs to',
    format: 'uuid',
  })
  @IsUUID()
  cigar_id: string;

  @ApiProperty({
    description: 'Name of the vitola',
    example: 'Robusto',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'Length of the vitola in inches (supports up to 2 decimal places)',
    example: 5.5,
    minimum: 0.1,
  })
  @IsNumber()
  @Min(0.1)
  length: number;

  @ApiProperty({
    description: 'Ring gauge of the vitola (must be a whole number)',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  ring_gauge: number;
}

export class VitolaGetDTO extends CreateVitolaDto {
  @ApiProperty({
    description: 'Unique identifier of the vitola',
    format: 'uuid',
  })
  id: string;
}
