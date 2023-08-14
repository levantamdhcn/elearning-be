import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Subject } from 'src/subject/schema/subject.schema';
import { TestCase } from '../interface';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  sampleCode: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  demand: string[];

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  lastAnswer: string;

  @Prop({ default: 1 })
  position: number;

  @Prop({ required: true })
  testCases: TestCase[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
  subject_id: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
