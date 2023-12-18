import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('/:courseId')
  @UseGuards(AuthGuard)
  create(
    @Param('courseId') courseId: string,
    @Body() createSubjectDto: CreateSubjectDto,
  ) {
    return this.subjectService.create(courseId, createSubjectDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    return this.subjectService.findAll(req.user);
  }

  @Get('course/:id')
  @UseGuards(AuthGuard)
  findByCourse(@Param('id') id: string, @Req() req) {
    return this.subjectService.findByCourse(id, req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.subjectService.remove(id);
  }
}
