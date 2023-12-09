import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDTO } from './dto/create.dto';
import { SubjectService } from 'src/subject/subject.service';
import { ExerciseSearchRequest } from './dto/exercise-search.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateExerciseDTO } from './dto/update.dto';

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

  @Get()
  get(
    @Query(new ValidationPipe({ whitelist: true }))
    query: ExerciseSearchRequest,
  ) {
    return this.exerciseService.find(query);
  }

  @Get('/:id')
  async getById(@Param() id: any) {
    console.log('id', id);
    return await this.exerciseService.findById(id.id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'API Update Exercise' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'testCaseFile', maxCount: 1 }]),
  )
  @ApiBody({ type: UpdateExerciseDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
  async editExercise(
    @Param('id') id: string,
    @Body() payload: UpdateExerciseDTO,
    @UploadedFiles()
    file: {
      testCaseFile: Express.Multer.File;
    },
  ) {
    return await this.exerciseService.updateExercise(id, payload, file);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'API Create Exercise' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'testCaseFile', maxCount: 1 }]),
  )
  @ApiBody({ type: CreateExerciseDTO })
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() data: CreateExerciseDTO,
    @UploadedFiles()
    file: {
      testCaseFile: Express.Multer.File;
    },
  ) {
    try {
      return await this.exerciseService.createExercise(data, file);
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'API Delete Exercise' })
  @UseGuards(AuthGuard)
  async deleteExercise(@Param('id') id: string) {
    return await this.exerciseService.removeExercise(id);
  }
}
