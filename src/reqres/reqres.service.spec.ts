import { Test, TestingModule } from '@nestjs/testing';
import { ReqresService } from './reqres.service';

describe('ReqresService', () => {
  let service: ReqresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqresService],
    }).compile();

    service = module.get<ReqresService>(ReqresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
