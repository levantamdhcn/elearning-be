import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, ExerciseDocument } from './schema/exercise.schema';
import { Model } from 'mongoose';
import { CreateExerciseDTO } from './dto/create.dto';
import { ExecuteDTO } from './dto/execute.dto';
import vm2 from '@subql/x-vm2';
import { SubjectService } from 'src/subject/subject.service';

const vm = new vm2.NodeVM({
  console: 'inherit',
  sandbox: {},
  require: {
    external: true,
    builtin: ['fs', 'path'],
    root: './',
    mock: {
      fs: {
        readFileSync() {
          return 'Nice try!';
        },
      },
    },
  },
});

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private enrollmentModel: Model<ExerciseDocument>,
    private readonly subjectService: SubjectService,
  ) {}

  async executeExercise(data: ExecuteDTO) {
    const exercise = await this.enrollmentModel.findById(data._id);
    if (!exercise) throw new Error('Exercise not found!');
    const key = exercise.key;

    // const s = new Sandbox();
    for (let i = 0; i < exercise.testCases.length; i++) {
      const testcase = exercise.testCases[i];
      // Run our key
      const ourKeyFunction = vm.run(`module.exports = ${key}`);
      const expectedValue = ourKeyFunction(...testcase.paramValue);

      // Run student key
      const studentKeyFunction = vm.run(`module.exports = ${data.script}`);
      const evaluatedValue = studentKeyFunction(...testcase.paramValue);

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

  async findById(id: string) {
    const exercise = await this.enrollmentModel.findById(id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  }

  async findBySubject(subjectId: string) {
    const subject = await this.subjectService.findOne(subjectId);
    if (!subject) {
      throw new Error('Subject not found');
    }
    return this.enrollmentModel.find({ subject_id: subject._id });
  }

  async findOne(query: object) {
    const exercise = await this.enrollmentModel.findOne(query);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
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
