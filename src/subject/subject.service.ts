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
import { CompletionSubjectService } from 'src/completion-subject/completion-subject.service';

@Injectable()
export class SubjectService {
  constructor(
    private readonly courseService: CourseService,
    private readonly completionSubjectService: CompletionSubjectService,
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

  async findAll(user) {
    const subjects = await this.subjectModel.find();

    const subjectQuery = subjects.map((subject) =>
      (async () => {
        const completion = await this.completionSubjectService.findAll({
          subjectId: subject._id,
          userId: user._id,
          courseId: subject.course_id,
        });
        if (completion) {
          subject.isCompleted = true;
        } else {
          subject.isCompleted = false;
        }
      })(),
    );

    await Promise.all(subjectQuery);

    return subjects;
  }

  async findByCourse(courseId: string, user) {
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const subjects = await this.subjectModel.find({ course_id: courseId });

    const subjectQuery = subjects.map((subject) =>
      (async () => {
        const completion = await this.completionSubjectService.findAll({
          subjectId: subject._id,
          userId: user._id,
          courseId: subject.course_id,
        });

        if (completion.length > 0) {
          subject.isCompleted = true;
        } else {
          subject.isCompleted = false;
        }
      })(),
    );

    await Promise.all(subjectQuery);

    return subjects;
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

  async countCompleted(id: string) {
    try {
      return await this.subjectModel.find({
        isCompleted: true,
        course_id: id,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async reportSubject() {
    try {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );

      const result = await this.subjectModel.aggregate([
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
