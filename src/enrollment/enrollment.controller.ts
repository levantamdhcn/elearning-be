import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentService.create(req.user, createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/check/:id')
  checkEnrollment(@Param('id') id: string, @Req() req) {
    return this.enrollmentService.checkEnroll(id, req.user);
  }

  @Get('/total/:id')
  getTotalEnroll(@Param('id') id: string) {
    return this.enrollmentService.totalEnrol(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(+id);
  }
}
