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
import { YoutubeUploadService } from 'src/youtube-upload/youtube-upload.service';
import { UserService } from 'src/users/users.service';
import { CompletionSubjectService } from 'src/completion-subject/completion-subject.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    private readonly enrollmentService: EnrollmentService,
    private readonly subjectService: SubjectService,
    private readonly completionSubjectService: CompletionSubjectService,
    private readonly exerciseService: ExerciseService,
    private readonly submissionService: SubmissionService,
    private readonly userService: UserService,
    private readonly youtubeUploadService: YoutubeUploadService,
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

        const completedSbj = await this.completionSubjectService.findAll({
          courseId: courses._id,
        });

        const completedEx = await this.exerciseService.countCompleted(
          courses.subjects || [],
        );

        const exerciseByCourse = await this.exerciseService.countBySubjects(
          courses.subjects || [],
        );

        courses.enrollments = enrollments;
        courses.completedSbj = completedSbj.length;
        courses.completedExercise = completedEx.length;
        courses.exercises = exerciseByCourse.length;

        return courses;
      })(),
    );

    await Promise.all(coursesQuery);

    return courses;
  }

  async reportEnrollment(query: ReportEnrollmentRequest) {
    const formatString = '%Y/%m/%d';
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
            time: {
              $dateToString: { format: formatString, date: '$createdAt' },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          time: '$_id.time', // Rename the field to 'formattedDate'
          count: 1,
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

  async reportViews() {
    try {
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
            },
          },
        ])
        .sort({ _id: -1 });
      const coursesQuery = courses.map((courses) =>
        (async () => {
          const videos = [];
          let totalViews = 0;
          const subjectByCourse = await this.subjectService.findByCourse(
            courses._id,
          );

          subjectByCourse.forEach((el) => {
            videos.push(el.video);
          });

          const videosQuery = videos.map((el) =>
            (async () => {
              const views = await this.youtubeUploadService.getYouTubeViewCount(
                el,
              );

              totalViews += parseInt(views);
            })(),
          );

          await Promise.all(videosQuery);
          courses.totalViews = totalViews;
          return courses;
        })(),
      );

      await Promise.all(coursesQuery);

      return courses;
    } catch (error) {
      throw new Error(error);
    }
  }

  async reportUsers() {
    const notEnrollAnyCourse = [];
    const enrolled = [];
    const notCompletedAnySubject = [];
    const users = await this.userService.getUsers();

    const notEnrollQuery = users.map((user) =>
      (async () => {
        const enroll = this.enrollmentService.findByUser(user._id);

        if (!enroll) {
          notEnrollAnyCourse.push(user._id);
        } else {
          enrolled.push(user._id);
        }

        const completion = await this.completionSubjectService.findAll({
          userId: user._id,
        });

        if (!completion || completion.length === 0) {
          notCompletedAnySubject.push(user._id);
        }
      })(),
    );

    await Promise.all(notEnrollQuery);

    return {
      users: users.length,
      enrolledCourse: enrolled.length,
      notCompletedAnySubject: notCompletedAnySubject.length,
      notEnrollAnyCourse: notEnrollAnyCourse.length,
    };
  }

  async reportSubmissions() {
    try {
      const result = await this.submissionService.report();

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
