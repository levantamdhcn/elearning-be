import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { config as appConfig } from './config';
import { config as cloudinaryConfig } from './cloudinary/config';

import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';

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
        const port = configService.get<string>('app.DB_PORT');
        const dbName = configService.get<string>('app.DB_NAME');
        const user = configService.get<string>('app.DB_USERNAME');
        const pass = configService.get<string>('app.DB_PASSWORD');

        const uri = `mongodb://${user}:${pass}@${host}:${port}/${dbName}`;
        console.log('>>> herher ', uri);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    SharedModule,
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
