import { Injectable } from '@nestjs/common';
import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Enrollment,
  EnrollmentDocument,
} from 'src/enrollment/schema/enrollment.schema';
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/course/schema/course.schema';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { SubjectService } from 'src/subject/subject.service';
import { ExerciseService } from 'src/exercise/exercise.service';
import { SubmissionService } from 'src/submission/submission.service';

@Injectable()
export class OverviewService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    private readonly enrollmentService: EnrollmentService,
    private readonly subjectService: SubjectService,
    private readonly exerciseService: ExerciseService,
    private readonly submissionService: SubmissionService,
  ) {}

  async courseOverview() {
    const courses = await this.courseModel
      .aggregate([
        {
          $project: {
            name: 1,
            title: 1,
            description: 1,
            image: 1,
            views: 1,
            hours: 1,
            lectures: 1,
            subjects: 1,
            demand: 1,
            subjectsCount: {
              $cond: {
                if: { $isArray: '$subjects' },
                then: { $size: '$subjects' },
                else: 0,
              },
            },
          },
        },
      ])
      .sort({ _id: -1 });

    const coursesQuery = courses.map((courses) =>
      (async () => {
        const enrollments = await this.enrollmentService.totalEnrol(
          courses._id,
        );

        const completedSbj = await this.subjectService.countCompleted(
          courses._id,
        );

        const completedEx = await this.exerciseService.countCompleted(
          courses._id,
        );

        console.log('completedEx', completedEx);

        courses.enrollments = enrollments;
        courses.completedSbj = completedSbj.length;

        return courses;
      })(),
    );

    await Promise.all(coursesQuery);

    return courses;
  }

  create(createOverviewDto: CreateOverviewDto) {
    return 'This action adds a new overview';
  }

  findAll() {
    return `This action returns all overview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} overview`;
  }

  update(id: number, updateOverviewDto: UpdateOverviewDto) {
    return `This action updates a #${id} overview`;
  }

  remove(id: number) {
    return `This action removes a #${id} overview`;
  }
}
