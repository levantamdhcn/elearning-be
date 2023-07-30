import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from 'src/course/schema/course.schema';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }])
  courses: Course[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
