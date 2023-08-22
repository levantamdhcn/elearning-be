import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CourseService } from 'src/course/course.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import {
  SubjectDocument,
  Subject as SubjectSchema,
} from './schema/subject.schema';

@Injectable()
export class SubjectService {
  constructor(
    private readonly courseService: CourseService,
    @InjectModel(SubjectSchema.name)
    private subjectModel: Model<SubjectDocument>,
  ) {}
  async create(courseId: string, createSubjectDto: CreateSubjectDto) {
    if (!createSubjectDto.video) throw new Error('Video is required');
    if (!courseId) throw new Error('Course is required');
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const subject = new this.subjectModel({
      ...createSubjectDto,
      course_id: course._id,
    });
    await subject.save();

    await this.courseService.updateWithQuery(courseId, {
      $push: { subjects: { _id: subject._id } },
    });

    return subject;
  }

  async findAll() {
    return this.subjectModel.find();
  }

  async findByCourse(courseId: string) {
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return this.subjectModel.find({ course_id: courseId });
  }

  findOne(id: string) {
    if (!id) throw new Error('Id is required');
    return this.subjectModel.findById(new mongoose.Types.ObjectId(id));
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    try {
      const subject = await this.subjectModel.findById(
        new mongoose.Types.ObjectId(id),
      );
      if (!subject) {
        throw new Error('Subject not found');
      }

      const newSubject = await this.subjectModel.findByIdAndUpdate(
        id,
        updateSubjectDto,
        { new: true },
      );

      return newSubject;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    const subject = await this.subjectModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    if (!subject) {
      throw new Error('Subject not found');
    }

    await this.subjectModel.findByIdAndDelete(id);

    return { message: 'Delete Sucessfull' };
  }
}
