import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Sandbox from 'sandbox';
import { Exercise, ExerciseDocument } from './schema/exercise.schema';
import { Model } from 'mongoose';
import { CreateExerciseDTO } from './dto/create.dto';
import { ExecuteDTO } from './dto/execute.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private enrollmentModel: Model<ExerciseDocument>,
  ) {}

  async executeExercise(data: ExecuteDTO) {
    const exercise = await this.enrollmentModel.findById(data._id);
    if (!exercise) throw new Error('Exercise not found!');
    const key = exercise.key;

    const s = new Sandbox();
    for (let i = 0; i < exercise.testCases.length; i++) {
      const testcase = exercise.testCases[i];
      let expectedValue;
      s.run(`(${key})(${testcase.paramValue.toString()})`, function (output) {
        expectedValue = output.result;
        console.log('expectedValue', expectedValue);
      });

      let evaluatedValue;
      s.run(
        `(${data.script})(${data.testCases[0].paramValue.toString()})`,
        function (output) {
          evaluatedValue = output.result;
          console.log('evaluatedValue', evaluatedValue);
        },
      );

      console.log('a');

      if (expectedValue !== evaluatedValue) {
        return {
          sucess: false,
          at_test: i,
          message: evaluatedValue,
        };
      }
    }
    return {
      sucess: true,
    };
  }

  async createExercise(data: CreateExerciseDTO) {
    try {
      const exercises = await this.enrollmentModel.find({
        subject_id: data.subject_id,
      });
      const newPosition = exercises[exercises.length - 1]
        ? exercises[exercises.length - 1].position + 1
        : 0;
      const newEx = await this.enrollmentModel.create({
        ...data,
        position: newPosition,
      });
      return newEx;
    } catch (error) {
      throw new Error(error);
    }
  }
}
