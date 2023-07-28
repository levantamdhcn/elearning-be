import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

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

  @Prop()
  demand: [string];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
