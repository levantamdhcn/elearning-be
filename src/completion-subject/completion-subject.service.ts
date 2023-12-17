import { Injectable } from '@nestjs/common';
import { CreateCompletionSubjectDto } from './dto/create-completion-subject.dto';
import { UpdateCompletionSubjectDto } from './dto/update-completion-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  CompletionSubject,
  CompletionSubjectDocument,
} from './schema/completion-subject.schema';
import { Model } from 'mongoose';
import { CompletionSubjectDtoRequest } from './dto/request-completion-subject.dto';

@Injectable()
export class CompletionSubjectService {
  constructor(
    @InjectModel(CompletionSubject.name)
    private completionSubjectModel: Model<CompletionSubjectDocument>,
  ) {}
  async create(createCompletionSubjectDto: CreateCompletionSubjectDto, user) {
    try {
      const completion = await this.completionSubjectModel.findOne({
        courseId: createCompletionSubjectDto.courseId,
        subjectId: createCompletionSubjectDto.subjectId,
        userId: user._id,
      });

      if (completion) throw new Error('You are already completed this course');
      const newCompletion = new this.completionSubjectModel({
        userId: user._id,
        courseId: createCompletionSubjectDto.courseId,
        subjectId: createCompletionSubjectDto.subjectId,
      });
      await newCompletion.save();
      return newCompletion;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(query: CompletionSubjectDtoRequest) {
    try {
      for (const propName in query) {
        if (!query[propName]) {
          delete query[propName];
        }
      }
      return await this.completionSubjectModel.find(query);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number) {
    try {
      return await this.completionSubjectModel.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.completionSubjectModel.findByIdAndUpdate(id, {
        isDelete: true,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
