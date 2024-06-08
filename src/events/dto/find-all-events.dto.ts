import { IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  SWAGGER_EVENTS_FIND_ALL_DTO_BASIC_DESCRIPTION,
  SWAGGER_EVENTS_FIND_ALL_DTO_BASIC_EXAMPLE,
  SWAGGER_EVENTS_FIND_ALL_DTO_CAMPUS_IDS_DESCRIPTION,
  SWAGGER_EVENTS_FIND_ALL_DTO_CAMPUS_IDS_EXAMPLE,
  SWAGGER_EVENTS_FIND_ALL_DTO_CURSUS_IDS_DESCRIPTION,
  SWAGGER_EVENTS_FIND_ALL_DTO_CURSUS_IDS_EXAMPLE,
  SWAGGER_EVENTS_FIND_ALL_DTO_RNCP_DESCRIPTION,
} from '../../common/constants/swagger/events.js';

export class FindAllEventsDto {
  @ApiProperty({
    description: SWAGGER_EVENTS_FIND_ALL_DTO_CAMPUS_IDS_DESCRIPTION,
    type: [Number],
    example: SWAGGER_EVENTS_FIND_ALL_DTO_CAMPUS_IDS_EXAMPLE,
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => parseInt(v)))
  campusIds?: Array<number>;

  @ApiProperty({
    description: SWAGGER_EVENTS_FIND_ALL_DTO_CURSUS_IDS_DESCRIPTION,
    type: [Number],
    example: SWAGGER_EVENTS_FIND_ALL_DTO_CURSUS_IDS_EXAMPLE,
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => parseInt(v)))
  cursusIds?: Array<number>;

  @ApiProperty({
    description: SWAGGER_EVENTS_FIND_ALL_DTO_RNCP_DESCRIPTION,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: string }) => {
    return value === 'true' || value === '1' ? true : value === 'false' || value === '0' ? false : undefined;
  })
  rncp?: boolean;

  @ApiProperty({
    description: SWAGGER_EVENTS_FIND_ALL_DTO_BASIC_DESCRIPTION,
    type: String,
    example: SWAGGER_EVENTS_FIND_ALL_DTO_BASIC_EXAMPLE,
    required: false,
  })
  basic?: never;
}
