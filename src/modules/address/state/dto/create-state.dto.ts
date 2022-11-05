import { Length } from 'class-validator';

export class StateDto {
  @Length(2, 50)
  name: string;
}
