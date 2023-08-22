import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { YoutubeUploadService } from './youtube-upload.service';

@Controller('youtube')
export class YoutubeUploadController {
  constructor(private readonly youtubeService: YoutubeUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideoToYoutube(
    @UploadedFile() video: Express.Multer.File,
  ): Promise<any> {
    const title = 'Your video title';
    const description = 'Your video description';
    const videoPath = video.path;

    return this.youtubeService.uploadVideo(title, description, videoPath);
  }

  @Get('auth')
  async auth(): Promise<any> {
    return this.youtubeService.auth();
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res): Promise<any> {
    return this.youtubeService.callback(code, res);
  }
}
