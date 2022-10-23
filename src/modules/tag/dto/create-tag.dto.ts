import { Length } from 'class-validator';

export class CreateTagDto {
  @Length(2, 80)
  readonly name: string;
}
