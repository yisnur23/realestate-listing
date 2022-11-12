import { IsOptional, IsUUID, Length, Min } from 'class-validator';

export class CreateListingDto {
  @Length(2, 80)
  title: string;
  @Length(2)
  description: string;
  @IsOptional()
  price: number;
  @IsOptional()
  number_of_floors: number;
  @IsOptional()
  floor_size: number;
  @IsOptional()
  lot_size: number;
  @IsOptional()
  year_built: number;
  @IsOptional()
  total_number_of_rooms: number;
  @IsOptional()
  number_of_bath_rooms: number;
  @IsOptional()
  number_of_bed_rooms: number;
  @IsOptional()
  @IsUUID('4', { each: true })
  tags: string[];
  @IsOptional()
  @IsUUID('4')
  neighbourhood_id: string;
}
