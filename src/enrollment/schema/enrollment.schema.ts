import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Subject } from 'src/subject/schema/subject.schema';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
