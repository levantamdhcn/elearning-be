import { forwardRef, Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { CourseModule } from 'src/course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './schema/subject.schema';
import { CompletionSubjectModule } from 'src/completion-subject/completion-subject.module';
import { YoutubeUploadModule } from 'src/youtube-upload/youtube-upload.module';

@Module({
  imports: [
    forwardRef(() => CourseModule),
    forwardRef(() => YoutubeUploadModule),
    forwardRef(() => CompletionSubjectModule),
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [
    SubjectService,
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
  ],
})
export class SubjectModule {}
