import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from 'src/course/schema/course.schema';
import { Subject } from 'src/subject/schema/subject.schema';
import { User } from 'src/users/schemas/users.schema';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courseId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
