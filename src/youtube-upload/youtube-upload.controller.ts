import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { YoutubeUploadService } from './youtube-upload.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadVideoDTO } from './dto';

@Controller('youtube')
export class YoutubeUploadController {
  constructor(private readonly youtubeService: YoutubeUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageFile', maxCount: 1 },
        { name: 'videoFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            // Generating a 32 random chars long string
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async uploadVideoToYoutube(
    @Body() data: UploadVideoDTO,
    @UploadedFiles() files,
  ): Promise<any> {
    const videoPath = files.videoFile[0].path;
    const imagePath = files.imageFile[0].path;

    return this.youtubeService.uploadVideo(data, videoPath, imagePath);
  }

  @Get('auth')
  async auth(): Promise<any> {
    return this.youtubeService.auth();
  }

  @Put('unauth')
  async unauth(): Promise<any> {
    return this.youtubeService.unauth();
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res): Promise<any> {
    return this.youtubeService.callback(code, res);
  }

  @Get('duration/:id')
  async duration(@Param('id') id: string) {
    return this.youtubeService.getDuration(id);
  }
}
