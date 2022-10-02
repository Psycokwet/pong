import { Test, TestingModule } from '@nestjs/testing';
import { FortytwoService } from './fortytwo.service';

describe('FortytwoService', () => {
  let service: FortytwoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FortytwoService],
    }).compile();

    service = module.get<FortytwoService>(FortytwoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
