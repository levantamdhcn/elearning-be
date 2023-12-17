import { IsString } from 'class-validator';

export class CompletionSubjectDtoRequest {
  @IsString()
  courseId?: string;

  @IsString()
  subjectId?: string;

  @IsString()
  userId?: string;
}
