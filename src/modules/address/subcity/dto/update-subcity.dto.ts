import { PartialType } from '@nestjs/swagger';
import { CreateSubcityDto } from './create-subcity.dto';

export class UpdateSubcityDto extends PartialType(CreateSubcityDto) {}
