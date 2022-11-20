import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsLongitude,
  IsLatitude,
  IsNumber,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ListingType } from '../entities/listing.entity';

class ComparisonObj {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gte: number;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lte: number;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  eq: number;
}

class ListingQuery {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  take: number;
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  skip: number;
  @ValidateNested()
  @Type(() => ComparisonObj)
  price: ComparisonObj;
  @ValidateNested()
  @Type(() => ComparisonObj)
  total_number_of_rooms: ComparisonObj;
  @ValidateNested()
  @Type(() => ComparisonObj)
  number_of_bath_rooms: ComparisonObj;
  @ValidateNested()
  @Type(() => ComparisonObj)
  number_of_bed_rooms: ComparisonObj;
  @ValidateNested()
  @Type(() => ComparisonObj)
  number_of_floors: ComparisonObj;
  @ValidateNested()
  @Type(() => ComparisonObj)
  lot_size: ComparisonObj;
  @ValidateNested()
  @Type(() => ComparisonObj)
  year_built: ComparisonObj;

  type: ListingType;
  @IsUUID()
  city_id: string;
  @IsUUID()
  state_id: string;
  @IsUUID('4', { each: true })
  tags: string[];
  @IsLatitude()
  latitude: number;
  @IsLongitude()
  longitude: number;
  @IsNumber()
  @Type(() => Number)
  radius: number;

  orderBy: string;

  s: string;
}

export class ListingQueryDto extends PartialType(ListingQuery) {}
