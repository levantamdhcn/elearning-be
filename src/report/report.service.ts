import { Injectable } from '@nestjs/common';
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
import { ReportEnrollmentRequest } from './dto/report-enrollment.dto';

@Injectable()
export class ReportService {
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
          courses.subjects || [],
        );

        const exerciseByCourse = await this.exerciseService.countBySubjects(
          courses.subjects || [],
        );

        courses.enrollments = enrollments;
        courses.completedSbj = completedSbj.length;
        courses.completedExercise = completedEx.length;
        courses.exercises = exerciseByCourse;

        return courses;
      })(),
    );

    await Promise.all(coursesQuery);

    return courses;
  }

  async reportEnrollment(query: ReportEnrollmentRequest) {
    const data = await this.enrollmentModel.aggregate([
      {
        $match: {
          // Match records within the specified date range
          createdAt: { $gte: query.startAt, $lte: query.endAt },
        },
      },
      {
        $group: {
          _id: {
            time: new Date(),
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);

    return data;
  }
}
