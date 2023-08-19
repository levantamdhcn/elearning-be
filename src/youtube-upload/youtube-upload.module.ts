import { Module } from '@nestjs/common';
import { YoutubeUploadService } from './youtube-upload.service';
import { YoutubeUploadController } from './youtube-upload.controller';

@Module({
  providers: [YoutubeUploadService],
  controllers: [YoutubeUploadController],
  exports: [YoutubeUploadService]
})
export class YoutubeUploadModule {}
