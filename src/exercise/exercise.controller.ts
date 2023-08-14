import { Body, Controller, Post } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDTO } from './dto/create.dto';
import { ExecuteDTO } from './dto/execute.dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(@Body() data: CreateExerciseDTO) {
    return this.exerciseService.createExercise(data);
  }
  @Post('/execute')
  executeExercise(@Body() data: ExecuteDTO) {
    return this.exerciseService.executeExercise(data);
  }
}
