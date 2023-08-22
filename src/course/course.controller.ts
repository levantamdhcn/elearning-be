import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    try {
      return this.courseService.create(createCourseDto, image);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get()
  findAll() {
    try {
      return this.courseService.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/popular')
  findPopular() {
    try {
      return this.courseService.findPopular();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.courseService.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseService.update(id, updateCourseDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.courseService.remove(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
