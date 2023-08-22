import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { config as appConfig } from './config';
import { config as cloudinaryConfig } from './cloudinary/config';

import { SharedModule } from './shared/shared.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CourseModule } from './course/course.module';
import { SubjectModule } from './subject/subject.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { YoutubeUploadModule } from './youtube-upload/youtube-upload.module';
import { CategoryModule } from './category/category.module';
import { MessageModule } from './message/message.module';
import { ExerciseModule } from './exercise/exercise.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${ENV}.local`, `.env.${ENV}`, '.env.local', '.env'],
      load: [appConfig, cloudinaryConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('app.DB_HOST');
        const dbName = configService.get<string>('app.DB_NAME');
        const user = configService.get<string>('app.DB_USERNAME');
        const pass = configService.get<string>('app.DB_PASSWORD');

        const uri = `mongodb+srv://${user}:${pass}@${host}/${dbName}`;

        console.log('>>> herher ', uri);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    CloudinaryModule,
    SharedModule,
    UsersModule,
    AuthModule,
    CourseModule,
    SubjectModule,
    EnrollmentModule,
    YoutubeUploadModule,
    CategoryModule,
    MessageModule,
    ExerciseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
