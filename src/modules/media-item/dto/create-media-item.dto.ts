import { Type } from 'class-transformer';
import { IsUrl, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { MediaItemType } from '../entities/media-item.entity';

export class CreateMediaItemDto {
  @IsUrl()
  url: string;
  @IsEnum(MediaItemType)
  type: MediaItemType;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  position: number;
}
