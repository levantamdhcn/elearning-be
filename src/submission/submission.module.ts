import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schema/submission.schema';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { ExerciseModule } from 'src/exercise/exercise.module';

@Module({
  imports: [
    forwardRef(() => ExerciseModule),
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    SubmissionService,
  ],
})
export class SubmissionModule {}
