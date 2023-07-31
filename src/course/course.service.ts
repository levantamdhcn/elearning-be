import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseDocument, Course as CourseSchema } from './schema/course.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseSchema.name) private courseModel: Model<CourseDocument>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    try {
      const newCourse = new this.courseModel(createCourseDto);
      await newCourse.save();
      return newCourse;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    return await this.courseModel.find();
  }

  async findPopular() {
    // this.courseModel
    //   .find()
    //   .sort({ views: -1 })
    //   .limit(10)

    return 'Popular';
  }

  async findOne(id: string) {
    return await this.courseModel.findById(new mongoose.Types.ObjectId(id));
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (!course) throw new Error('Course not found!');
    const newCouse = await this.courseModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      updateCourseDto,
      { new: true },
    );
    return newCouse;
  }

  async updateWithQuery(id: string, query: object) {
    const course = await this.courseModel.findByIdAndUpdate(id, query, {
      new: true,
    });
    return course;
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    if (!course) throw new Error('Course not found!');
    await this.courseModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    return 'Delete successful';
  }
}
