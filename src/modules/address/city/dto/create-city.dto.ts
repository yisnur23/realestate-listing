import { IsUUID, Length } from 'class-validator';

export class CreateCityDto {
  @Length(2, 80)
  name: string;
  @IsUUID()
  state_id: string;
}
