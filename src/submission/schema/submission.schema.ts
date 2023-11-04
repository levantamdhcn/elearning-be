import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Exercise } from 'src/exercise/schema/exercise.schema';
import { User } from 'src/users/schemas/users.schema';
import {
  ESubmissionLanguage,
  ESubmissionStatus,
} from '../constants/submission';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ default: 0 })
  runtime: number;

  @Prop()
  timeSubmitted: Date;

  @Prop()
  timeUpdated: Date;

  @Prop({ default: ESubmissionStatus.INITIAL })
  status: ESubmissionStatus;

  @Prop({ default: ESubmissionLanguage.JAVASCRIPT })
  language: ESubmissionLanguage;

  @Prop({ required: true })
  solution: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Exercise.name })
  exercise_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_id: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
