import { Test, TestingModule } from '@nestjs/testing';
import { ParicionesService } from './pariciones.service';

describe('ParicionesService', () => {
  let service: ParicionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParicionesService],
    }).compile();

    service = module.get<ParicionesService>(ParicionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
