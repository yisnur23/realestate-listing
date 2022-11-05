import { IsUUID, Length } from 'class-validator';

export class CreateSubcityDto {
  @Length(2, 80)
  name: string;
  @IsUUID()
  city_id: string;
}
