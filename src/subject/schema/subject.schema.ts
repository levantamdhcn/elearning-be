import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from 'src/course/schema/course.schema';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  name: string;

  @Prop()
  content: string;

  @Prop()
  thumbnail: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: 0 })
  duration: number;

  @Prop()
  lastViewPos: number;

  @Prop({ required: true })
  video: string;

  @Prop()
  position: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  course_id: Course[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
