import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateMediaItemDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  position: number;
}
