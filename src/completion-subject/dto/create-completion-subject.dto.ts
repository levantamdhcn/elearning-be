import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompletionSubjectDto {
  @IsString()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  subjectId: string;
}
