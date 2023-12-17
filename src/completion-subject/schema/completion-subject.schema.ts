import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from 'src/course/schema/course.schema';
import { Subject } from 'src/subject/schema/subject.schema';
import { User } from 'src/users/schemas/users.schema';

export type CompletionSubjectDocument = CompletionSubject & Document;

@Schema({ timestamps: true })
export class CompletionSubject {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
  subjectId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courseId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ default: false })
  isDelete: boolean;
}

export const CompletionSubjectSchema =
  SchemaFactory.createForClass(CompletionSubject);
