import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeUploadService } from './youtube-upload.service';

describe('YoutubeUploadService', () => {
  let service: YoutubeUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubeUploadService],
    }).compile();

    service = module.get<YoutubeUploadService>(YoutubeUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
