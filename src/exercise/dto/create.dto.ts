import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExerciseDTO {
  @ApiProperty({
    required: true,
    example: 'question',
  })
  @IsNotEmpty()
  questionName: string;

  @ApiProperty({
    required: true,
    example: 'function getTotal(a,b) { return a + b }',
  })
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  mainFunction: string;

  @IsNotEmpty()
  solution: string;

  @IsNotEmpty()
  solutionTester: string;

  @IsNotEmpty()
  mappedTitle: string;

  @ApiProperty({
    required: true,
    example: '["demand1", "demand2"]',
  })
  @IsNotEmpty()
  demands: string[];

  @ApiProperty({
    required: true,
    default: false,
  })
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  testCaseFile: Express.Multer.File;
}
