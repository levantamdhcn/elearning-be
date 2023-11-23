import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schema/submission.schema';

import { sleep } from 'src/utils';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import moment from 'moment';
import { ESubmissionStatus } from './constants/submission';
import * as RunnerManager from '../judgingengine/RunnerManager';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
  ) {}

  async insert(data: CreateSubmissionDto) {
    sleep();
    console.log('data', data);
    try {
      const submission = await this.submissionModel.create({
        ...data,
        timeSubmitted: moment(new Date(Date.now())),
        timeUpdated: moment(new Date(Date.now())),
        runtime: 0,
        status: ESubmissionStatus.INITIAL,
      });

      return submission;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, data: Partial<CreateSubmissionDto>) {
    sleep();
    try {
      const submission = await this.submissionModel.findByIdAndUpdate(
        id,
        {
          ...data,
          timeUpdated: moment(new Date(Date.now())),
        },
        { new: true },
      );

      return submission;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id: string) {
    try {
      await this.submissionModel.findByIdAndDelete(id);
      return { success: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async run(data: CreateSubmissionDto) {
    if (data._id) {
      await this.submissionModel.findByIdAndUpdate(
        data._id,
        {
          solution: data.solution,
          timeUpdated: moment(new Date(Date.now())),
        },
        { new: true },
      );

      const submission = await this.submissionModel
        .findById(data._id)
        .populate('exercise');

      const result = this.run_solution(submission);
      return result;
      // RUN
    } else {
      const newSubmission = await this.insert(data);
      const submission = await this.submissionModel
        .findById(newSubmission._id)
        .populate('exercise');

      const result = this.run_solution(submission);
      return result;
    }
  }

  run_solution(submission) {
    const start_time = moment(new Date(Date.now()));
    console.log('submission', submission);
    RunnerManager.run(
      submission.exercise.questionName,
      submission.language,
      submission.solution,
      async (status: string, message: string) => {
        if (
          status === ESubmissionStatus.PASS ||
          status == ESubmissionStatus.FAIL
        ) {
          const end_time = moment(new Date(Date.now()));
          const runtime = moment(end_time, 'DD/MM/YYYY HH:mm:ss').diff(
            moment(start_time, 'DD/MM/YYYY HH:mm:ss'),
          );

          const newSubmission = await this.submissionModel.findByIdAndUpdate(
            submission._id,
            {
              ...submission,
              status,
              runtime,
              timeSubmitted: moment(new Date(Date.now())),
            },
            { new: true },
          );

          return newSubmission;
        } else {
          return status;
        }
      },
    );
    console.log('submission', submission);
  }
}
