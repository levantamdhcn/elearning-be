import { forwardRef, Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { CourseModule } from 'src/course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './schema/subject.schema';
import { CompletionSubjectModule } from 'src/completion-subject/completion-subject.module';
import { YoutubeUploadModule } from 'src/youtube-upload/youtube-upload.module';
import { Exercise, ExerciseSchema } from 'src/exercise/schema/exercise.schema';

@Module({
  imports: [
    forwardRef(() => CourseModule),
    forwardRef(() => YoutubeUploadModule),
    forwardRef(() => CompletionSubjectModule),
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [
    SubjectService,
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
  ],
})
export class SubjectModule {}
