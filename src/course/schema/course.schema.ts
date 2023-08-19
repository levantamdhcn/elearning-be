import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Subject } from 'src/subject/schema/subject.schema';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  hours: number;

  @Prop()
  lectures: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Subject.name }] })
  subjects: Subject[];

  @Prop()
  demand: [string];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
