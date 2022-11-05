import { IsUUID, Length } from 'class-validator';

export class CreateNeighbourhoodDto {
  @Length(2, 80)
  name: string;
  @IsUUID()
  woreda_id: string;
}
