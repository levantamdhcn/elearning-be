import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportEnrollmentRequest } from './dto/report-enrollment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/course')
  courseOverview() {
    return this.reportService.courseOverview();
  }

  @Get('/overview')
  overview() {
    return this.reportService.overview();
  }

  @Get('/enrollment')
  reportEnrollment(
    @Query(new ValidationPipe({ whitelist: true }))
    query: ReportEnrollmentRequest,
  ) {
    return this.reportService.reportEnrollment(query);
  }

  @Get('/views')
  @UseGuards(AuthGuard)
  reportViews(@Req() req) {
    return this.reportService.reportViews(req.user);
  }

  @Get('/users')
  reportUsers() {
    return this.reportService.reportUsers();
  }

  @Get('/submissions')
  reportExercise() {
    return this.reportService.reportSubmissions();
  }
}
