import { IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SWAGGER_EVENTS_ROUTE } from '../../common/constants/swagger/events.js';

export class FindAllEventsDto {
  @ApiProperty(SWAGGER_EVENTS_ROUTE.query.campusIds)
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => parseInt(v)))
  campusIds?: Array<number>;

  @ApiProperty(SWAGGER_EVENTS_ROUTE.query.cursusIds)
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => parseInt(v)))
  cursusIds?: Array<number>;

  @ApiProperty(SWAGGER_EVENTS_ROUTE.query.rncp)
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: string }) => {
    return value === 'true' || value === '1' ? true : value === 'false' || value === '0' ? false : undefined;
  })
  rncp?: boolean;

  @ApiProperty(SWAGGER_EVENTS_ROUTE.query.basic)
  basic?: never;
}
