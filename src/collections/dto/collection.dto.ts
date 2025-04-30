import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDto {
  @ApiProperty()
  cigar_id: string;

  @ApiProperty()
  vitola_id: string;

  @ApiProperty({ default: 1 })
  quantity: number;

  @ApiProperty({ required: false })
  storage_date?: Date;
}

export class UpdateCollectionDto extends CreateCollectionDto {}
