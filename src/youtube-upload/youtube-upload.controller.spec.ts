import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeUploadController } from './youtube-upload.controller';

describe('YoutubeUploadController', () => {
  let controller: YoutubeUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeUploadController],
    }).compile();

    controller = module.get<YoutubeUploadController>(YoutubeUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
