import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schema/submission.schema';

import { sleep } from 'src/utils';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import moment from 'moment';
import { ESubmissionStatus } from './constants/submission';
import * as RunnerManager from '../judgingengine/RunnerManager';
import { Response } from 'express';
import {
  Exercise,
  ExerciseDocument,
} from 'src/exercise/schema/exercise.schema';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    @InjectModel(Exercise.name)
    private exerciseModel: Model<ExerciseDocument>,
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

  async findByKeys(exerciseId: string, submissionId: string, userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    sleep();
    if (!exerciseId) {
      throw new Error('Invalid parameter: exerciseId');
    }
    const keysArr = exerciseId.split(',');

    if (keysArr.length != 2) {
      throw new Error('Invalid parameter: exerciseId');
    }

    this.exerciseModel.findOne({ _id: exerciseId }, function (err, exercise) {
      if (err) {
        throw new Error(err);
      }
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      //console.log(submissions);
      const retq = {
        _id: exercise._id,
        title: exercise.title,
        description: exercise.description,
        mainFunction: exercise.mainFunction,
        solution: exercise.solution,
        id1: '',
        id2: '',
        id3: '',
      };

      // get submissions if exist
      if (submissionId) {
        _this.submissionModel.aggregate(
          [
            { $match: { exercise: exerciseId, user: userId } },
            { $sort: { timeupdated: -1 } },
            { $group: { _id: '$language', latest: { $first: '$$ROOT' } } },
            {
              $project: {
                _id: '$latest._id',
                user: '$latest.user',
                exercise: '$latest.exercise',
                solution: '$latest.solution',
                language: '$latest.language',
                status: '$latest.status',
                timeUpdated: '$latest.timeUpdated',
                timeSubmitted: '$latest.timeSubmitted',
                runtime: '$latest.runtime',
              },
            },
            { $sort: { language: 1 } },
          ],
          function (err, submissions) {
            if (err) {
              throw new Error(err);
            }
            if (submissions) {
              // replace the solution in question with user's submission
              for (let i = 0; i < submissions.length; i++) {
                const submission = submissions[i];
                retq.mainFunction = submission.solution;
                if (submission.status == ESubmissionStatus.INITIAL) {
                  retq.id1 = submission._id;
                }
              }
            }
            //console.log(retq.id1);
            //console.log(retq);
            return retq;
          },
        );
      } else {
        // user has not logged in yet, just return question
        return retq;
      }
    });
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

  async run(data: CreateSubmissionDto, res: Response) {
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

      const result = this.run_solution(submission, res);
      return result;
      // RUN
    } else {
      const newSubmission = await this.insert(data);
      const submission = await this.submissionModel
        .findById(newSubmission._id)
        .populate('exercise');

      const result = this.run_solution(submission, res);
      return result;
    }
  }

  async run_solution(submission, res) {
    const start_time = moment(new Date(Date.now()));
    RunnerManager.run(
      submission.exercise.title,
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
              status,
              runtime,
              timeSubmitted: moment(new Date(Date.now())),
            },
            { new: true },
          );

          if (status === ESubmissionStatus.PASS) {
            await this.exerciseModel.findByIdAndUpdate(
              submission.exercise._id,
              {
                isCompleted: true,
              },
              { new: true },
            );
          }
          res.json({ status, newSubmission, message });
        } else {
          res.json(status);
        }
      },
    );
  }
}
