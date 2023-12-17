import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CompletionSubjectService } from './completion-subject.service';
import { CreateCompletionSubjectDto } from './dto/create-completion-subject.dto';
import { UpdateCompletionSubjectDto } from './dto/update-completion-subject.dto';
import { CompletionSubjectDtoRequest } from './dto/request-completion-subject.dto';

@Controller('completion-subject')
export class CompletionSubjectController {
  constructor(
    private readonly completionSubjectService: CompletionSubjectService,
  ) {}

  @Post()
  async create(
    @Body() createCompletionSubjectDto: CreateCompletionSubjectDto,
    @Req() req,
  ) {
    return await this.completionSubjectService.create(
      createCompletionSubjectDto,
      req.user,
    );
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ whitelist: true }))
    query: CompletionSubjectDtoRequest,
  ) {
    return this.completionSubjectService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.completionSubjectService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.completionSubjectService.remove(+id);
  }
}
