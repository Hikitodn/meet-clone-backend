import { Test, TestingModule } from '@nestjs/testing';
import { RoomSchedulesService } from './room-schedules.service';

describe('RoomSchedulesService', () => {
  let service: RoomSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomSchedulesService],
    }).compile();

    service = module.get<RoomSchedulesService>(RoomSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
