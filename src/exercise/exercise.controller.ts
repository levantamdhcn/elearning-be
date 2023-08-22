import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDTO } from './dto/create.dto';
import { ExecuteDTO } from './dto/execute.dto';
import { SubjectService } from 'src/subject/subject.service';

@Controller('exercise')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly subjectService: SubjectService,
  ) {}

  @Get('subject/:id')
  getBySubject(@Param() id: string) {
    return this.exerciseService.findBySubject(id);
  }

  @Get('/:id')
  getById(@Param() id: any) {
    console.log('id', id);
    return this.exerciseService.findById(id.id);
  }

  @Post()
  create(@Body() data: CreateExerciseDTO) {
    return this.exerciseService.createExercise(data);
  }
  @Post('/execute')
  executeExercise(@Body() data: ExecuteDTO) {
    return this.exerciseService.executeExercise(data);
  }
}
