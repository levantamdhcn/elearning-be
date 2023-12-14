import { Module, forwardRef } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Enrollment,
  EnrollmentSchema,
} from 'src/enrollment/schema/enrollment.schema';
import { Course, CourseSchema } from 'src/course/schema/course.schema';
import { Subject, SubjectSchema } from 'src/subject/schema/subject.schema';
import { Exercise, ExerciseSchema } from 'src/exercise/schema/exercise.schema';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { SubjectModule } from 'src/subject/subject.module';
import { ExerciseModule } from 'src/exercise/exercise.module';
import { SubmissionModule } from 'src/submission/submission.module';

@Module({
  imports: [
    forwardRef(() => EnrollmentModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => ExerciseModule),
    forwardRef(() => SubmissionModule),
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
