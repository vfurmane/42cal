import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllEventsDto {
  @IsOptional()
  @IsNumberString({}, { each: true })
  campusIds?: Array<number>;
}
