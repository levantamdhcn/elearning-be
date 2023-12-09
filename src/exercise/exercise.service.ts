import fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, ExerciseDocument } from './schema/exercise.schema';
import { Model } from 'mongoose';
import { CreateExerciseDTO } from './dto/create.dto';
import { SubjectService } from 'src/subject/subject.service';
import { ExerciseSearchRequest } from './dto/exercise-search.dto';
import writeFileRecursive from 'src/utils/writeFileRecursive';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private exerciseModel: Model<ExerciseDocument>,
    private readonly subjectService: SubjectService,
  ) {}

  async find(query: ExerciseSearchRequest) {
    if (!query?.subjects || query?.subjects?.length === 0) {
      return this.exerciseModel.find({}).populate('subject_id').lean();
    }
    return this.exerciseModel
      .find({ subject_id: { $in: query.subjects } })
      .populate('subject_id')
      .lean();
  }

  // async executeExercise(data: ExecuteDTO) {
  //   const exercise = await this.exerciseModel.findById(data._id);
  //   if (data.script === '') {
  //     return {
  //       sucess: false,
  //       at_test: 0,
  //       message: 'Function is not defined.',
  //     };
  //   }
  //   if (!exercise) throw new Error('Exercise not found!');
  //   const key = exercise.mainFunction;

  //   // const s = new Sandbox();
  //   for (let i = 0; i < exercise.testCases.length; i++) {
  //     const testcase = exercise.testCases[i];
  //     // Run our key
  //     const ourKeyFunction = vm.run(`module.exports = ${key}`);
  //     const expectedValue = ourKeyFunction(...testcase.paramValue);

  //     // Run student key
  //     const studentKeyFunction = vm.run(`module.exports = ${data.script}`);
  //     const evaluatedValue = studentKeyFunction(...testcase.paramValue);

  //     if (expectedValue !== evaluatedValue) {
  //       return {
  //         sucess: false,
  //         at_test: i,
  //         message:
  //           evaluatedValue === undefined
  //             ? 'Function must return a value.'
  //             : evaluatedValue,
  //       };
  //     }
  //   }
  //   return {
  //     sucess: true,
  //   };
  // }

  async findById(id: string) {
    const exercise = await this.exerciseModel.findById(id);
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
    return this.exerciseModel.find({ subject_id: subject._id });
  }

  async findOne(query: object) {
    const exercise = await this.exerciseModel.findOne(query);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  }

  async createExercise(data: CreateExerciseDTO, file: any) {
    try {
      const ex = await this.exerciseModel.findOne({
        title: data.mappedTitle,
      });

      if (ex) {
        throw new NotFoundException('This exercise is exist');
      }

      if (data.solution) {
        writeFileRecursive(
          `src/solution/${data.mappedTitle}/javascript/Solution.js`,
          data.solution,
          (err) => {
            if (err) throw err;

            console.log('Solution is wrote successfully');
          },
        );
      }
      if (data.solutionTester) {
        writeFileRecursive(
          `src/solution/${data.mappedTitle}/javascript/SolutionTester.js`,
          data.solution,
          (err) => {
            if (err) throw err;

            console.log('Solution Tester is wrote successfully');
          },
        );
      }

      if (data.solutionTester) {
        writeFileRecursive(
          `src/solution/${data.mappedTitle}/javascript/SolutionTester.js`,
          data.solutionTester,
          (err) => {
            if (err) throw err;

            console.log('Solution Tester is wrote successfully');
          },
        );
      }

      if (file?.testCaseFile) {
        fs.writeFile(
          `src/solution/${data.mappedTitle}/testcase.txt`,
          file.testCaseFile[0].buffer,
          (err) => {
            if (err) console.log(err);
          },
        );

        writeFileRecursive(
          `src/solution/${data.mappedTitle}/testresult.txt`,
          '',
          (err) => {
            if (err) throw err;

            console.log('Solution Tester is wrote successfully');
          },
        );
      }

      const exercises = await this.exerciseModel.find({
        subject_id: data.subject_id,
      });
      const newPosition = exercises[exercises.length - 1]
        ? exercises[exercises.length - 1].position + 1
        : 0;

      const newExercise = await this.exerciseModel.create({
        title: data.mappedTitle,
        questionName: data.questionName,
        description: data.description,
        mainFunction: data.mainFunction,
        demands: data.demands,
        position: newPosition,
        subject_id: data.subject_id,
        solution: data.solution,
      });

      await newExercise.save();

      return newExercise;
    } catch (error) {
      throw new Error(error);
    }
  }
}
