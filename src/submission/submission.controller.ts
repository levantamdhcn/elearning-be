import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submission')
export class ExerciseController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() data: CreateSubmissionDto) {
    return this.submissionService.insert(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateSubmissionDto>) {
    return this.submissionService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.submissionService.delete(id);
  }
}
