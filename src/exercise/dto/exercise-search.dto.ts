import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class ExerciseSearchRequest {
  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value
          .trim()
          .split(',')
          .map((id) => String(id)),
  )
  @IsArray()
  subjects: string[];
}
