import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment, EnrollmentDocument } from './schema/enrollment.schema';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
  ) {}
  async create(user: any, createEnrollmentDto: CreateEnrollmentDto) {
    if (!createEnrollmentDto.id || !user)
      throw new Error('Course and User is required');
    const enroll = new this.enrollmentModel({
      userId: user._id,
      courseId: createEnrollmentDto.id,
    });
    await enroll.save();
    return enroll;
  }

  async checkEnroll(courseId: string, user: any) {
    if (courseId && user._id) {
      const enrollment = await this.enrollmentModel.findOne({
        courseId: courseId,
      });

      if (enrollment && enrollment.userId.toString() === user._id.toString()) {
        return { enrolled: true };
      } else {
        return { enrolled: false };
      }
    }
  }

  async totalEnrol(courseId: string) {
    try {
      if (courseId) {
        const enrollments = await this.enrollmentModel.find({
          courseId: courseId,
        });
        return enrollments?.length;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all enrollment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
