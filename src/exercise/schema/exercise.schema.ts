import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Subject } from 'src/subject/schema/subject.schema';
import { TestCase } from '../interface';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true })
  questionName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  mainFunction: string;

  @Prop({ required: true })
  solution: string;

  @Prop({ required: true })
  demands: string[];

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: 1 })
  position: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
  subject_id: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
