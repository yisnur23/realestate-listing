import {
  IsOptional,
  IsUUID,
  Length,
  IsLatitude,
  IsLongitude,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from '../entities/listing.entity';
import { CreateMediaItemDto } from '../../media-item/dto/create-media-item.dto';

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
  @IsEnum(ListingType, {
    message: 'type value is not correct',
  })
  type: ListingType;
  @IsOptional()
  @IsUUID('4', { each: true })
  tags: string[];
  @IsOptional()
  @IsUUID('4')
  city_id: string;
  @IsOptional()
  @IsLatitude()
  latitude: number;
  @IsOptional()
  @IsLongitude()
  longitude: number;
  @ValidateNested({ each: true })
  @Type(() => CreateMediaItemDto)
  mediaItems: CreateMediaItemDto[];
}
