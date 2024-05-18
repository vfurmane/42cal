import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindAllEventsDto {
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => parseInt(v)))
  campusIds?: Array<number>;

  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => parseInt(v)))
  cursusIds?: Array<number>;
}
