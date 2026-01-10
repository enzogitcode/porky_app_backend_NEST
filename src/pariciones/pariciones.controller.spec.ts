import { Test, TestingModule } from '@nestjs/testing';
import { ParicionesController } from './pariciones.controller';
import { ParicionesService } from './pariciones.service';

describe('ParicionesController', () => {
  let controller: ParicionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParicionesController],
      providers: [ParicionesService],
    }).compile();

    controller = module.get<ParicionesController>(ParicionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
