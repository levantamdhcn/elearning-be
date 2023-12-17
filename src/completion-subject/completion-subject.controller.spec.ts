import { Test, TestingModule } from '@nestjs/testing';
import { CompletionSubjectController } from './completion-subject.controller';
import { CompletionSubjectService } from './completion-subject.service';

describe('CompletionSubjectController', () => {
  let controller: CompletionSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletionSubjectController],
      providers: [CompletionSubjectService],
    }).compile();

    controller = module.get<CompletionSubjectController>(CompletionSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
