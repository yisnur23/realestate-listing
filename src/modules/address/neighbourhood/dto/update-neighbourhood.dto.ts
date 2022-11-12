import { PartialType } from '@nestjs/swagger';
import { CreateNeighbourhoodDto } from './create-neighbourhood.dto';

export class UpdateNeighbourhoodDto extends PartialType(
  CreateNeighbourhoodDto,
) {}
