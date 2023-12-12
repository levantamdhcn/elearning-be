import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('run')
  async run(@Body() data: CreateSubmissionDto, @Res() res: Response) {
    return await this.submissionService.run(data, res);
  }

  @Get('/exercise/:exerciseId')
  @UseGuards(AuthGuard)
  async get(@Param('exerciseId') exerciseId, @Req() req) {
    return await this.submissionService.findByKeys(exerciseId, req.user._id);
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
