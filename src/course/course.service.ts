import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseDocument, Course as CourseSchema } from './schema/course.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ExerciseService } from 'src/exercise/exercise.service';
import {
  Exercise,
  ExerciseDocument,
  ExerciseSchema,
} from 'src/exercise/schema/exercise.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseSchema.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Exercise.name)
    private exerciseModel: Model<ExerciseDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(createCourseDto: CreateCourseDto, image?: Express.Multer.File) {
    try {
      if (image) {
        const { url } = image
          ? await this.cloudinaryService.uploadFile(image)
          : null;
        createCourseDto.image = url;
      }
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
    const results = await this.courseModel.find().sort({ views: -1 }).limit(5);
    return results;
  }

  async findOne(id: string) {
    const course = await this.courseModel
      .findById(new mongoose.Types.ObjectId(id))
      .lean();

    const exerciseByCourse = await this.exerciseModel.aggregate([
      {
        $match: {
          subject_id: {
            $in: course.subjects,
          },
        },
      },
    ]);

    return {
      ...course,
      exercises: exerciseByCourse,
    };
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    image: Express.Multer.File,
  ) {
    const course = await this.courseModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    if (!course) throw new Error('Course not found!');
    if (image) {
      const { url } = image
        ? await this.cloudinaryService.uploadFile(image)
        : null;
      updateCourseDto.image = url;
    }
    const newCouse = await this.courseModel.findByIdAndUpdate(
      course._id,
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
    const course = await this.courseModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    if (!course) throw new Error('Course not found!');
    await this.courseModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    return 'Delete successful';
  }

  async reportCourse() {
    try {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );

      const result = await this.courseModel.aggregate([
        {
          $group: {
            _id: null,
            allTime: { $sum: 1 },
            thisMonth: {
              $sum: {
                $cond: [{ $gte: ['$createdAt', startOfMonth] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            allTime: 1,
            thisMonth: 1,
          },
        },
      ]);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
