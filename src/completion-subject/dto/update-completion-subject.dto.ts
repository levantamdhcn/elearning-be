import { PartialType } from '@nestjs/swagger';
import { CreateCompletionSubjectDto } from './create-completion-subject.dto';

export class UpdateCompletionSubjectDto extends PartialType(CreateCompletionSubjectDto) {}
