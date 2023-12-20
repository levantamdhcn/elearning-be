import { Module, forwardRef } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schema/course.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ExerciseModule } from 'src/exercise/exercise.module';
import { ExerciseService } from 'src/exercise/exercise.service';
import { Exercise, ExerciseSchema } from 'src/exercise/schema/exercise.schema';

@Module({
  imports: [
    // forwardRef(() => ExerciseModule),
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    CourseService,
  ],
})
export class CourseModule {}
