import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TestCase } from '../interface';

export class ExecuteDTO {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  script: string;

  @IsNotEmpty()
  testCases: TestCase[];

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  subject_id: string;
}
