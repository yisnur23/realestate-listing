import { PartialType } from '@nestjs/swagger';
import { CreateWoredaDto } from './create-woreda.dto';

export class UpdateWoredaDto extends PartialType(CreateWoredaDto) {}
