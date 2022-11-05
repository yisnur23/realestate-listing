import { IsUUID, Length, ValidateIf } from 'class-validator';

export class CreateWoredaDto {
  @Length(2, 30)
  name: string;
  @IsUUID()
  @ValidateIf((obj) => obj.city_id === undefined || obj.subcity_id)
  subcity_id: string;
  @IsUUID()
  @ValidateIf((obj) => obj.subcity_id === undefined || obj.city_id)
  city_id: string;
}
