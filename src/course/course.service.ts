import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseDocument, Course as CourseSchema } from './schema/course.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseSchema.name) private courseModel: Model<CourseDocument>,
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
    return await this.courseModel.findById(new mongoose.Types.ObjectId(id));
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    image: Express.Multer.File,
  ) {
    const course = await this.findOne(id);
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
    const course = await this.findOne(id);
    if (!course) throw new Error('Course not found!');
    await this.courseModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    return 'Delete successful';
  }
}
