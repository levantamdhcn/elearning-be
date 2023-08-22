import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TestCase } from '../interface';

export class CreateExerciseDTO {
  @ApiProperty({
    required: true,
    example: 'question',
  })
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    required: true,
    example: 'function getTotal(a,b) { return a + b }',
  })
  @IsNotEmpty()
  sampleCode: string;

  @ApiProperty({
    required: true,
    example: '["demand1", "demand2"]',
  })
  @IsNotEmpty()
  demand: string[];

  @ApiProperty({
    required: true,
    default: false,
  })
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  testCases: TestCase[];

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  subject_id: string;
}
