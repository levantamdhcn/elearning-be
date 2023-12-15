import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Sort } from 'src/shared/constant';

export class ReportEnrollmentRequest {
  @ApiProperty({
    type: 'string',
    default: '',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  endAt: Date;

  @ApiProperty({
    type: 'string',
    default: '',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  startAt: Date;

  @ApiProperty({ enum: Sort, default: Sort.DESC })
  @IsOptional()
  @Transform(({ value }) => (value as string).toUpperCase() || Sort.DESC)
  @IsEnum(Sort)
  sort?: Sort = Sort.DESC;
}
