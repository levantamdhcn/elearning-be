import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Response } from 'express';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('run')
  async run(@Body() data: CreateSubmissionDto, @Res() res: Response) {
    return await this.submissionService.run(data, res);
  }
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
