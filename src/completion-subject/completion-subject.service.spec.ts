import { Test, TestingModule } from '@nestjs/testing';
import { CompletionSubjectService } from './completion-subject.service';

describe('CompletionSubjectService', () => {
  let service: CompletionSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletionSubjectService],
    }).compile();

    service = module.get<CompletionSubjectService>(CompletionSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
