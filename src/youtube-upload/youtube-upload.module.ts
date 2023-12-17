import { Module } from '@nestjs/common';
import { YoutubeUploadService } from './youtube-upload.service';
import { YoutubeUploadController } from './youtube-upload.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [YoutubeUploadService],
  controllers: [YoutubeUploadController],
  exports: [YoutubeUploadService]
})
export class YoutubeUploadModule {}
