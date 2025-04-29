import { IsString, IsUUID, IsNumber, Min } from 'class-validator';
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
    description: 'Length of the vitola in inches',
    example: 5,
  })
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({
    description: 'Ring gauge of the vitola',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  ring_gauge: number;
}

export class VitolaGetDTO extends CreateVitolaDto {
  @ApiProperty({
    description: 'Unique identifier of the vitola',
    format: 'uuid',
  })
  id: string;
}
