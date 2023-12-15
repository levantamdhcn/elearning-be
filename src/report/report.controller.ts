import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportEnrollmentRequest } from './dto/report-enrollment.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/course')
  courseOverview() {
    return this.reportService.courseOverview();
  }

  @Get('/enrollment')
  reportEnrollment(
    @Query(new ValidationPipe({ whitelist: true }))
    query: ReportEnrollmentRequest,
  ) {
    return this.reportService.reportEnrollment(query);
  }
}
