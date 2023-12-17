import { Module } from '@nestjs/common';
import { CompletionSubjectService } from './completion-subject.service';
import { CompletionSubjectController } from './completion-subject.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletionSubject,
  CompletionSubjectSchema,
} from './schema/completion-subject.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletionSubject.name, schema: CompletionSubjectSchema },
    ]),
  ],
  controllers: [CompletionSubjectController],
  providers: [CompletionSubjectService],
  exports: [
    MongooseModule.forFeature([
      { name: CompletionSubject.name, schema: CompletionSubjectSchema },
    ]),
    CompletionSubjectService,
  ],
})
export class CompletionSubjectModule {}
